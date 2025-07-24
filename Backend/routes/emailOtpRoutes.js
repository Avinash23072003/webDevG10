const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Make sure User model exists and is properly defined
const router = express.Router();
require('dotenv').config();
// ✅ Temporary in-memory OTP store (for dev only, replace with Redis or DB for prod)
const otpStore = new Map();

// ✅ Debug check for environment variables
console.log('📧 MAIL_USER:', process.env.MAIL_USER);
console.log('🔐 MAIL_PASS:', process.env.MAIL_PASS ? 'Loaded ✅' : '❌ Missing');

// ✅ Setup Nodemailer transporter with full debug
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  logger: true,
  debug: true, // enables SMTP conversation logs
});

// 📤 Send OTP Route
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;
  console.log(`📩 OTP requested for email: ${email}`);

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ Email already registered:', email);
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 Generated OTP for ${email}: ${otp}`);
console.log(process.env.MAIL_USER)
    // Email options
    const mailOptions = {
      from: `"Desi-Etsy" <${process.env.MAIL_USER}>`,
      to: email,
      subject: '🛡️ OTP Verification - Desi-Etsy',
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #cc5200;">Desi-Etsy OTP Verification</h2>
          <p>Hello,</p>
          <p><strong>Your OTP: <span style="color: #cc5200;">${otp}</span></strong></p>
          <p>Valid for 5 minutes. Please do not share it with anyone.</p>
          <p style="color: #888;">- Desi-Etsy Team</p>
        </div>
      `,
    };

    // Send Email
  transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ OTP Email Failed:', err);
        return res.status(500).json({ error: 'Failed to send OTP. Check email settings.' });
      } else {
        console.log('✅ OTP Email Sent:', info.response);
        otpStore.set(email, otp);
        console.log('🗃️ OTP stored in memory for 5 minutes');
        setTimeout(() => {
          otpStore.delete(email);
          console.log('⌛ OTP expired and removed for', email);
        }, 5 * 60 * 1000);
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('❌ Server Error while sending OTP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Verify OTP Route
router.post('/verify-email-otp', (req, res) => {
  const { email, otp } = req.body;
  console.log(`🔍 Verifying OTP for ${email}: Entered = ${otp}`);

  const storedOtp = otpStore.get(email);
  if (!storedOtp) {
    console.log('⚠️ No OTP found or OTP expired for', email);
    return res.status(400).json({ verified: false, message: 'OTP expired or not sent' });
  }

  if (storedOtp === otp) {
    console.log('✅ OTP verified successfully for', email);
    otpStore.delete(email); // One-time use
    return res.status(200).json({ verified: true });
  } else {
    console.log('❌ Invalid OTP for', email);
    return res.status(400).json({ verified: false, message: 'Invalid OTP' });
  }
});

module.exports = router;
