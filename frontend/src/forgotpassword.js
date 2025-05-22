import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input change for email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation: Ensure email is not empty
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    // Send the email to the backend for password reset
    axios
      .post('http://localhost:8081/forgot-password', { email })
      .then((res) => {
        if (res.data.status === 'success') {
          setSuccessMessage('A password reset link has been sent to your email.');
          setError(''); // Clear any previous errors
          // Optionally, navigate to another page
          // navigate('/some-success-page');
        } else {
          setError('Failed to send password reset link. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Error sending password reset:', err);
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
          <h2>Trouble with logging in?</h2>
          <p>
            Enter your email address, and we'll send you a link to get back into your account.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
                className="form-control rounded-0"
              />
              {error && <span className="text-danger">{error}</span>}
              {successMessage && <span className="text-success">{successMessage}</span>}
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-0">
              Send login link
            </button>
          </form>

          {/* OR Separator */}
          <div className="mt-3 text-center">
            <hr style={{ width: '50%', margin: 'auto' }} />
            <span>OR</span>
            <hr style={{ width: '50%', margin: 'auto' }} />
          </div>

          {/* Create New Account Link */}
          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none mb-2"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;