const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        console.log(req.body);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;