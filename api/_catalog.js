// Prices live HERE, on the server, so nobody can change them in their browser.
// Keep ids and names in sync with PRODUCTS in index.html.
// Prices are in US dollars.
const PRODUCTS = {
    'tee-1': { name: 'Acid Wash T-Shirt - Color 1', price: 25 },
    'tee-2': { name: 'Acid Wash T-Shirt - Color 2', price: 25 },
    'tee-3': { name: 'Acid Wash T-Shirt - Color 3', price: 25 },
    'tee-4': { name: 'Acid Wash T-Shirt - Color 4', price: 25 },
    'tee-5': { name: 'Acid Wash T-Shirt - Color 5', price: 25 }
};

const SIZES = ['S', 'M', 'L', 'XL'];

// Where your shop lives. Used for the return link after payment and to only
// accept requests from your own site. Override with the SITE_URL env var.
const SITE_URL = process.env.SITE_URL || 'https://jeanfinesseee03-creator.github.io/Wealth-Style/';
const SITE_ORIGIN = new URL(SITE_URL).origin;

function setCors(req, res) {
    const origin = req.headers.origin;
    const allowed = [SITE_ORIGIN, 'http://localhost:8000', 'http://127.0.0.1:8000'];
    if (origin && allowed.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = { PRODUCTS, SIZES, SITE_URL, setCors };
