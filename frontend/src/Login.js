import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from './LoginValidation';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      axios
        .post('http://localhost:8081/login', values)
        .then((res) => {
          if (res.data.status === "success") {
            localStorage.setItem('userId', res.data.userId);
            navigate('/dashboard');
          } else {
            alert('No record existed');
          }
        })
        .catch((err) => {
          console.error("Login failed:", err);
          alert('Login failed. Please try again.');
        });
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #004e92, #00b4db)' // Darker blue to lighter blue gradient
    }}>
      <div className="bg-white p-3 rounded w-25">
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                onChange={handleInput}
                className="form-control rounded-0"
              />
              {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>
            <div className="mb-3">
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleInput}
                className="form-control rounded-0"
              />
              {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-success w-100 rounded-0">
              Log In
            </button>
            <p>You agree to our terms and conditions</p>
            <Link
              to="/signup"
              className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none mb-2"
            >
              Create Account
            </Link>
            <Link
              to="/forgot-password"
              className="btn btn-link w-100 text-center text-decoration-none"
            >
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;