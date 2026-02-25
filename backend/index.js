const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
console.log('🔄 Iniciando Aura Backend...');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const { generatePalette } = require('./services/aiService');

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const app = express();

// Stripe Webhook needs raw body for signature verification
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const customerEmail = session.customer_details.email;
            const subscriptionId = session.subscription;

            // Get price ID to know which plan it is
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0].price.id;

            let plan = 'FREE';
            if (priceId === process.env.STRIPE_PRICE_PLUS) plan = 'PLUS';
            if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'PRO';

            console.log(`💰 Pago completado: ${customerEmail} -> ${plan}`);

            // Usamos upsert para soportar pagos de usuarios que aún no están en nuestra DB
            await prisma.user.upsert({
                where: { email: customerEmail },
                update: {
                    plan: plan,
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: subscriptionId
                },
                create: {
                    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    email: customerEmail,
                    plan: plan,
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: subscriptionId,
                    points: 50 // Bonus por suscripción
                }
            });
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            await prisma.user.updateMany({
                where: { stripeSubscriptionId: subscription.id },
                data: { plan: 'FREE' }
            });
            console.log('📉 Suscripción cancelada, usuario vuelto a FREE');
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// For other routes, use standard JSON parsing with higher limit for images
app.use(express.json({ limit: '200mb' }));

// Middleware de autenticación de Supabase con sincronización de DB
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
            console.error('[Auth] Error de Supabase:', error.message);
        } else if (user) {
            try {
                // Sincronizar usuario (upsert) para asegurar que exista en la DB local
                // Usamos email como llave de enlace para reconectar pagos de Stripe realizados como 'invitado'
                const dbUser = await prisma.user.upsert({
                    where: { email: user.email },
                    update: {
                        id: user.id, // Actualizamos el ID al oficial de Supabase
                        fullName: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0],
                        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture
                    },
                    create: {
                        id: user.id,
                        email: user.email,
                        fullName: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0],
                        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                        plan: 'FREE',
                        points: 10
                    }
                });
                req.user = dbUser;
                console.log(`[Auth] Sesión activa para: ${dbUser.email} (DB ID: ${dbUser.id})`);
            } catch (dbError) {
                console.error('[Auth] Error de sincronización DB local:', dbError.message);
                console.error('CONSEJO: Verifica que DATABASE_URL en .env tenga la contraseña correcta.');
                req.user = user;
            }
        }
    } catch (err) {
        console.error('[Auth] Error de sistema:', err.message);
    }
    next();
};

app.use(helmet({
    contentSecurityPolicy: false, // For Apollo Sandbox
}));
app.use(cors());
app.get('/', (req, res) => {
    res.send('🚀 Aura Backend está funcionando correctamente. GraphQL disponible en /graphql');
});

app.use(authenticate);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'Aura Backend is alive', timestamp: new Date() });
});

// --- ENDPOINTS DE EXPORTACIÓN ---
app.get('/export/:id/:format', async (req, res) => {
    const { id, format } = req.params;
    const ExportService = require('./services/exportService');

    try {
        const palette = await prisma.palette.findUnique({ where: { id } });
        if (!palette) return res.status(404).send('Paleta no encontrada');

        switch (format) {
            case 'figma':
                return res.json(ExportService.toFigma(palette));

            case 'css':
                res.setHeader('Content-Type', 'text/css');
                res.setHeader('Content-Disposition', `attachment; filename="${palette.name}.css"`);
                return res.send(ExportService.toCSS(palette));

            case 'ase':
                const aseBuffer = ExportService.toASE(palette);
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${palette.name}.ase"`);
                return res.send(Buffer.from(aseBuffer));

            case 'canva':
                const canvaBuffer = await ExportService.toCanvaImage(palette);
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Content-Disposition', `attachment; filename="aura-canva-${palette.name}.png"`);
                return res.send(canvaBuffer);

            default:
                return res.status(400).send('Formato no soportado');
        }
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).send('Error interno en la exportación');
    }
});

// Simple TypeDefs for testing
const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    fullName: String
    avatarUrl: String
    plan: String!
    points: Int
  }

  type Color {
    hex: String!
    name: String!
    psychology: String
  }

  type TypographySuggestion {
    heading: String
    body: String
  }

  type PaletteIA {
    name: String!
    colors: [Color!]!
    typography_suggestion: TypographySuggestion
    vibe: String
  }

  type Palette {
    id: ID!
    name: String!
    colors: [Color!]!
    isPublic: Boolean!
    aiGenerated: Boolean!
    tags: [String!]
    createdAt: String!
  }

  input ColorInput {
    hex: String!
    name: String!
    psychology: String
  }

  type Comment {
    id: ID!
    content: String!
    user: User!
    resourceId: ID!
    parentCommentId: ID
    replies: [Comment!]
    createdAt: String!
  }

  type Collaboration {
    id: ID!
    resourceType: String!
    resourceId: ID!
    user: User!
    role: String!
    status: String!
    createdAt: String!
  }

  type ActivityLog {
    id: ID!
    actionType: String!
    pointsEarned: Int!
    createdAt: String!
  }

  type UserBadge {
    badgeName: String!
    unlockedAt: String!
  }

  type Notification {
    id: ID!
    type: String!
    title: String!
    message: String!
    read: Boolean!
    link: String
    createdAt: String!
  }

  type Query {
    hello: String
    me: User
    myPalettes: [Palette!]!
    palette(id: ID!): Palette
    generateIAPalette(prompt: String!, image: String): PaletteIA
    getComments(resourceId: ID!): [Comment!]!
    getCollaborators(resourceId: ID!): [Collaboration!]!
    getActivityLogs: [ActivityLog!]!
    getMyBadges: [UserBadge!]!
    myNotifications: [Notification!]!
    searchUserByEmail(email: String!): User
  }

  type Mutation {
    createCheckoutSession(priceId: String!): String
    savePalette(name: String!, colors: [ColorInput!]!, aiGenerated: Boolean, tags: [String!]): Palette
    deletePalette(id: ID!): Boolean
    addComment(resourceId: ID!, content: String!, parentCommentId: ID): Comment
    addCollaboration(resourceId: ID!, resourceType: String!, userId: ID!, role: String): Collaboration
    markNotificationAsRead(id: ID!): Boolean
    simulatePlanUpgrade(plan: String!): User
  }
`;

// Simple Resolvers for testing
const resolvers = {
    Query: {
        hello: () => 'Bienvenido a Aura API',
        me: async (_, __, { user }) => {
            if (!user) return null;
            return await prisma.user.findUnique({ where: { id: user.id } });
        },
        generateIAPalette: async (_, { prompt, image }, { user }) => {
            console.log(`[GraphQL] Generando paleta para prompt: "${prompt}" ${image ? '(con imagen)' : ''} (Usuario: ${user?.email || 'Anónimo'})`);
            try {
                const palette = await generatePalette(prompt, image);
                console.log(`[GraphQL] IA respondió con éxito para: "${prompt}"`);

                if (user) {
                    try {
                        console.log(`[GraphQL] Actualizando puntos para usuario ${user.id}...`);
                        // Sumar puntos por generar (5 pts)
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { points: { increment: 5 } }
                        });
                        console.log(`[GraphQL] Puntos actualizados.`);
                    } catch (dbError) {
                        console.error(`[GraphQL] Error DB actualizando puntos:`, dbError.message);
                        // No fallar la generación si solo fallan los puntos
                    }
                }
                return palette;
            } catch (error) {
                console.error(`[GraphQL] Error fatal en generación:`, error.message);
                throw error;
            }
        },
        myPalettes: async (_, __, { user }) => {
            if (!user) throw new Error('No autorizado');
            return await prisma.palette.findMany({
                where: { ownerId: user.id },
                orderBy: { createdAt: 'desc' }
            });
        },
        palette: async (_, { id }, { user }) => {
            // Permitimos ver si es pública o si el usuario es el dueño
            // Por ahora simplificamos a que sea el dueño
            if (!user) throw new Error('No autorizado');
            return await prisma.palette.findUnique({
                where: { id: id }
            });
        },
        getComments: async (_, { resourceId }) => {
            return await prisma.comment.findMany({
                where: { resourceId, parentCommentId: null },
                include: { user: true, replies: { include: { user: true } } },
                orderBy: { createdAt: 'asc' }
            });
        },
        getCollaborators: async (_, { resourceId }) => {
            return await prisma.collaboration.findMany({
                where: { resourceId },
                include: { user: true }
            });
        },
        getActivityLogs: async (_, __, { user }) => {
            if (!user) throw new Error('No autorizado');
            return await prisma.activityLog.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: 10
            });
        },
        getMyBadges: async (_, __, { user }) => {
            if (!user) throw new Error('No autorizado');
            return await prisma.userBadge.findMany({
                where: { userId: user.id }
            });
        },
        myNotifications: async (_, __, { user }) => {
            if (!user) throw new Error('No autorizado');
            return await prisma.notification.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });
        },
        searchUserByEmail: async (_, { email }) => {
            return await prisma.user.findUnique({ where: { email } });
        }
    },
    Mutation: {
        addComment: async (_, { resourceId, content, parentCommentId }, { user }) => {
            if (!user) throw new Error('No autorizado');
            const comment = await prisma.comment.create({
                data: { resourceId, content, userId: user.id, parentCommentId },
                include: { user: true }
            });

            // Gana 2 puntos por comentar
            await prisma.user.update({
                where: { id: user.id },
                data: { points: { increment: 2 } }
            });
            await prisma.activityLog.create({
                data: { userId: user.id, actionType: 'comment_add', pointsEarned: 2 }
            });

            return comment;
        },
        addCollaboration: async (_, { resourceId, resourceType, userId, role }, { user }) => {
            if (!user) throw new Error('No autorizado');
            if (user.plan === 'FREE') throw new Error('La colaboración requiere el plan PLUS o PRO');
            console.log(`[Mutation] Añadiendo colaborador ${userId} a recurso ${resourceId}...`);
            const collab = await prisma.collaboration.create({
                data: {
                    resourceId,
                    resourceType,
                    userId,
                    role: role || 'VIEWER',
                    invitedById: user.id
                },
                include: { user: true }
            });

            // Crear notificación para el usuario invitado
            try {
                const resource = resourceType === 'PALETTE'
                    ? await prisma.palette.findUnique({ where: { id: resourceId } })
                    : { name: 'un recurso' };

                await prisma.notification.create({
                    data: {
                        userId,
                        type: 'INVITE',
                        title: 'Nueva invitación',
                        message: `${user.fullName} te ha invitado a colaborar en "${resource?.name || 'un recurso'}" como ${role || 'VIEWER'}.`,
                        link: `/projects/${resourceId}`
                    }
                });
                console.log(`[Mutation] Colaboración y notificación creadas con éxito.`);
            } catch (notifyError) {
                console.error('[Mutation] Error enviando notificación:', notifyError.message);
            }

            return collab;
        },
        createCheckoutSession: async (_, { priceId }, { user }) => {
            const { createCheckoutSession } = require('./services/stripeService');
            // Si el usuario está autenticado, pasamos su email. Si no, Stripe lo pedirá.
            return await createCheckoutSession(user?.email || null, priceId);
        },
        savePalette: async (_, { name, colors, aiGenerated, tags }, { user }) => {
            if (!user) throw new Error('No autorizado');

            console.log(`[Mutation] Guardando paleta "${name}" para usuario ${user.id}`);
            try {
                const palette = await prisma.palette.create({
                    data: {
                        name,
                        colors,
                        aiGenerated: aiGenerated || false,
                        tags: tags || [],
                        ownerId: user.id
                    }
                });

                console.log(`[Mutation] Paleta guardada con ID: ${palette.id}. Actualizando puntos...`);

                // Gana 10 puntos por guardar
                await prisma.user.update({
                    where: { id: user.id },
                    data: { points: { increment: 10 } }
                });

                await prisma.activityLog.create({
                    data: {
                        userId: user.id,
                        actionType: 'palette_save',
                        pointsEarned: 10
                    }
                });

                return palette;
            } catch (err) {
                console.error('[Mutation] Error al guardar paleta:', err.message);
                throw new Error(`Error de base de datos: ${err.message}`);
            }
        },
        deletePalette: async (_, { id }, { user }) => {
            if (!user) throw new Error('No autorizado');
            console.log(`[Mutation] Intentando borrar paleta ${id} del usuario ${user.id}...`);

            try {
                // Eliminar de moodboards primero para evitar error de FK (Foreign Key)
                await prisma.moodboardPalette.deleteMany({
                    where: { paletteId: id }
                });

                // También eliminar colaboraciones asociadas
                await prisma.collaboration.deleteMany({
                    where: { resourceId: id, resourceType: 'PALETTE' }
                });

                const result = await prisma.palette.deleteMany({
                    where: { id, ownerId: user.id }
                });

                if (result.count === 0) {
                    console.warn(`[Mutation] No se encontró la paleta ${id} o no pertenece al usuario.`);
                } else {
                    console.log(`[Mutation] Paleta ${id} borrada con éxito.`);
                }

                return true;
            } catch (err) {
                console.error('[Mutation] Error enviando borrado:', err.message);
                throw new Error(`Error al borrar paleta: ${err.message}`);
            }
        },
        markNotificationAsRead: async (_, { id }, { user }) => {
            if (!user) throw new Error('No autorizado');
            await prisma.notification.updateMany({
                where: { id, userId: user.id },
                data: { read: true }
            });
            return true;
        },
        simulatePlanUpgrade: async (_, { plan }, { user }) => {
            if (!user) throw new Error('No autorizado');
            console.log(`[Test] Simulando subida de plan a ${plan} para ${user.email}`);
            return await prisma.user.update({
                where: { id: user.id },
                data: { plan }
            });
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const startServer = async () => {
    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({ user: req.user }),
    }));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Aura Backend listo en http://localhost:${PORT}/graphql`);
    });
};

startServer();
