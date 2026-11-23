// Vercel serverless function: GET /api/session-status?session_id=cs_...
// Used when a customer comes back from a payment method that redirects them
// (for example some bank apps), so the site can show "thank you" or "try again".
const Stripe = require('stripe');
const { setCors } = require('./_catalog');

module.exports = async (req, res) => {
    setCors(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const id = String((req.query && req.query.session_id) || '');
    if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return res.status(400).json({ error: 'Bad session id' });

    try {
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(id);
        return res.status(200).json({ status: session.status, payment_status: session.payment_status });
    } catch (err) {
        return res.status(404).json({ error: 'Session not found' });
    }
};
