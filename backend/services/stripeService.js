async function setupStripeProducts() {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log(`[Backend-Stripe] Iniciando sesión para: ${priceId} con Key: ${process.env.STRIPE_SECRET_KEY?.substring(0, 8)}...`);

    try {
        const sessionData = {
            payment_method_types: ['card'],
            allow_promotion_codes: true, // Habilitar cupones y códigos promocionales
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'https://chroma-sync-aura.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'https://chroma-sync-aura.vercel.app'}/pricing`,
        };

        if (customerEmail) {
            sessionData.customer_email = customerEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionData);
        return session.url;
    } catch (error) {
        console.error('❌ Error creating checkout session:', error.message);
        throw new Error(`Stripe Error: ${error.message}`);
    }
}

module.exports = { setupStripeProducts, createCheckoutSession };
