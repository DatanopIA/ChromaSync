const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Crea los productos y precios base para Aura en Stripe.
 * Este script se debe ejecutar una sola vez para configurar el entorno.
 */
async function setupStripeProducts() {
    try {
        // 1. Crear Plan PLUS
        const plusProduct = await stripe.products.create({
            name: 'Aura Plus',
            description: 'Paletas ilimitadas, mockups básicos y tipografía avanzada.',
        });

        const plusPrice = await stripe.prices.create({
            unit_amount: 799, // 7.99€
            currency: 'eur',
            recurring: { interval: 'month' },
            product: plusProduct.id,
        });

        // 2. Crear Plan PRO
        const proProduct = await stripe.products.create({
            name: 'Aura Pro',
            description: 'Todo lo de Plus + Colaboración en equipo, plugins Figma/Canva y mockups profesionales editables.',
        });

        const proPrice = await stripe.prices.create({
            unit_amount: 1499, // 14.99€
            currency: 'eur',
            recurring: { interval: 'month' },
            product: proProduct.id,
        });

        console.log('✅ Productos de Stripe creados con éxito:');
        console.log(`- PLUS: ${plusPrice.id}`);
        console.log(`- PRO: ${proPrice.id}`);

        return {
            plusPriceId: plusPrice.id,
            proPriceId: proPrice.id
        };
    } catch (error) {
        console.error('❌ Error al configurar Stripe:', error.message);
    }
}

async function createCheckoutSession(customerEmail, priceId) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            customer_email: customerEmail,
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing`,
        });
        return session.url;
    } catch (error) {
        console.error('❌ Error creating checkout session:', error.message);
        throw new Error('No se pudo crear la sesión de pago.');
    }
}

module.exports = { setupStripeProducts, createCheckoutSession };
