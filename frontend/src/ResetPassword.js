import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Handle input change for password
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages
  };

  // Handle input change for confirm password
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation: Ensure passwords match and are not empty
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please enter both passwords.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Send the new password to the backend for password reset
    axios
      .post(`http://localhost:8081/reset-password/${token}`, { password })
      .then((res) => {
        if (res.data.status === 'success') {
          setSuccessMessage('Your password has been updated successfully.');
          setError(''); // Clear any previous errors
          navigate('/login'); // Navigate to login page
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.error('Error resetting password:', err);
        setError('An error occurred. Please try again later.');
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #004e92, #00b4db)', // Darker blue to lighter blue gradient
      }}
    >
      <div className="bg-white p-3 rounded w-25">
        <div>
          <h2>Reset Your Password</h2>
          <p>Please enter your new password.</p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={handlePasswordChange}
                className="form-control rounded-0"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="form-control rounded-0"
              />
            </div>
            {error && <span className="text-danger">{error}</span>}
            {successMessage && <span className="text-success">{successMessage}</span>}
            <button type="submit" className="btn btn-primary w-100 rounded-0">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;