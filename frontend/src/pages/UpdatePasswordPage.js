import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import '../index.css';
import { useNavigate } from "react-router-dom";

const UpdatePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Get token and user email from localStorage
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let email = "";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      email = user?.email || "";
    } catch {
      email = "";
    }
  }

  const getPasswordError = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Must include at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Must include at least one lowercase letter.';
    if (!/\d/.test(password)) return 'Must include at least one number.';
    if (!/[\W_]/.test(password)) return 'Must include at least one special character.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      return;
    }

    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/update-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'Password updated successfully') {
        setSuccess(true);
        toast.success('Password updated successfully!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(response.data.message || 'Password update failed');
      }
    } catch (err) {
      console.error("Password update failed", err);
      toast.error(err.response?.data?.message || 'Password update failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">Update Password 🔐</h2>

        {email && (
          <input
            type="email"
            value={email}
            readOnly
            className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700 cursor-not-allowed mb-4"
          />
        )}

        {success ? (
          <p className="text-green-600 text-center font-semibold">Password updated successfully!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-2.5 cursor-pointer text-lg"
              >
                {showOld ? '🙈' : '👁️'}
              </span>
            </div>

            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 cursor-pointer text-lg"
              >
                {showNew ? '🙈' : '👁️'}
              </span>
            </div>

            {newPassword && getPasswordError(newPassword) && (
              <p className="text-sm text-red-600">{getPasswordError(newPassword)}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
