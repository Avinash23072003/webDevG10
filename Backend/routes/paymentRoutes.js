const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // ✅ Multiply here only
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1, // Auto-capture
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order Created:", order);

    res.status(200).json(order); // ✅ return full order object
  } catch (err) {
    console.error("❌ Razorpay order creation failed:", err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

module.exports = router;
