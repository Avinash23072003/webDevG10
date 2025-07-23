import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const EmailOtpForm = ({ onVerified }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Email validation helper
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/otp/send-email-otp`, { email });
      toast.success('OTP sent to your email');
      setShowOtpInput(true);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/otp/verify-email-otp`, { email, otp });
      if (res.data.verified) {
        toast.success('Email verified ✅');
        onVerified(email);
      } else {
        toast.error('Incorrect OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Email Verification
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        disabled={showOtpInput}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />

      {showOtpInput && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {!showOtpInput || timer === 0 ? (
        <button
          onClick={handleSendOtp}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          {showOtpInput ? 'Resend OTP' : 'Send OTP'}
        </button>
      ) : (
        <p className="mt-4 text-center text-gray-500">⏳ Resend available in {timer}s</p>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default EmailOtpForm;
