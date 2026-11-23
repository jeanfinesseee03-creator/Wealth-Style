# Stripe checkout setup

The shop page stays on **GitHub Pages**. Payments need a tiny server that holds your
secret key, so that part runs on **Vercel** (free plan is fine):

```
Customer's browser  ──cart (ids, sizes, qty)──▶  Vercel: /api/create-checkout-session
        ▲                                              │ looks up real prices, asks Stripe
        └──────── Stripe embedded payment form ◀───────┘ for a checkout session
```

Prices are set in `api/_catalog.js`, never in the browser, so nobody can change them.

## 1. Get your Stripe keys (test mode first)

1. Sign in at https://dashboard.stripe.com and make sure **Test mode** is on.
2. Go to **Developers → API keys**. You need:
   - **Publishable key** `pk_test_...` (safe to put in the website)
   - **Secret key** `sk_test_...` (NEVER put this in the website or on GitHub)

## 2. Deploy the functions to Vercel

1. Sign in at https://vercel.com with your GitHub account.
2. **Add New → Project**, pick the `Wealth-Style` repo, click **Deploy**
   (no build settings needed).
3. In the project: **Settings → Environment Variables**, add:
   - `STRIPE_SECRET_KEY` = your `sk_test_...` key
   - `SITE_URL` = `https://jeanfinesseee03-creator.github.io/Wealth-Style/`
4. **Deployments → ⋯ → Redeploy** so the variables take effect.
5. Note your Vercel address, for example `https://wealth-style.vercel.app`.

## 3. Connect the website

In `index.html`, near the top of the `<script>` section:

```js
const STRIPE_PUBLISHABLE_KEY = 'pk_test_...';            // your publishable key
const API_BASE = 'https://wealth-style.vercel.app';      // your Vercel address
```

Commit and push. GitHub Pages updates in a minute or two.

## 4. Test it

Add shirts to the cart, click **Checkout**, and pay with test card
`4242 4242 4242 4242`, any future date, any CVC, any ZIP.
The payment shows up under **Payments** in your Stripe Dashboard (test mode),
with the size of each shirt in the item name.

Other test cards: `4000 0025 0000 3155` (asks for 3D Secure),
`4000 0000 0000 9995` (declined).

## 5. Go live

1. Activate your Stripe account (business and bank details).
2. Swap in the live keys: `pk_live_...` in `index.html`, `sk_live_...` in Vercel, then redeploy.

## Changing products or prices

Edit **both** places, keeping the same `id`:
- `PRODUCTS` in `index.html` (name, price shown, photos)
- `PRODUCTS` in `api/_catalog.js` (name and price actually charged)

Shipping is limited to the US. Change `allowed_countries` in
`api/create-checkout-session.js` to ship elsewhere, for example `['US', 'CA', 'GB']`.
