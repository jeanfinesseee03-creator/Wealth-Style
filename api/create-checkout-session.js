// Vercel serverless function: POST /api/create-checkout-session
// Body: { items: [{ id: 'tee-1', size: 'M', qty: 2 }, ...] }
// Returns: { client_secret } for Stripe's embedded checkout form.
const Stripe = require('stripe');
const { PRODUCTS, SIZES, SITE_URL, setCors } = require('./_catalog');

const MAX_QTY = 20;

module.exports = async (req, res) => {
    setCors(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Server is missing STRIPE_SECRET_KEY' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = null; }
    }
    const items = body && Array.isArray(body.items) ? body.items : [];

    // Build line items from OUR catalog. Only id, size and qty come from the browser.
    const lineItems = [];
    for (const item of items) {
        const product = PRODUCTS[item && item.id];
        const qty = Number(item && item.qty);
        if (!product || !SIZES.includes(item.size) || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
            return res.status(400).json({ error: 'Your cart has an item we could not find. Please refresh and try again.' });
        }
        lineItems.push({
            quantity: qty,
            price_data: {
                currency: 'usd',
                unit_amount: Math.round(product.price * 100), // Stripe uses cents
                product_data: {
                    name: `${product.name} (Size ${item.size})`,
                    metadata: { product_id: item.id, size: item.size }
                }
            }
        });
    }

    if (lineItems.length === 0 || lineItems.length > 50) {
        return res.status(400).json({ error: 'Your cart is empty.' });
    }

    try {
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'form',
            mode: 'payment',
            line_items: lineItems,
            // You ship shirts, so ask for an address. Add more country codes as needed.
            shipping_address_collection: { allowed_countries: ['US'] },
            phone_number_collection: { enabled: true },
            // Size per item, so you know what to pack (also visible in the Dashboard).
            metadata: {
                order: items.map(i => `${i.id}:${i.size}x${i.qty}`).join(', ').slice(0, 500)
            },
            return_url: `${SITE_URL}?session_id={CHECKOUT_SESSION_ID}#shop`
        });

        return res.status(200).json({ client_secret: session.client_secret });
    } catch (err) {
        console.error('Stripe error:', err.message);
        return res.status(500).json({ error: 'Could not start checkout. Please try again.' });
    }
};
