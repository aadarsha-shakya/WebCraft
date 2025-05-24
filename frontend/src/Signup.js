import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupValidation from './SignupValidation';
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor', // Default role is vendor
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = SignupValidation(values); // Get the validation errors
    setErrors(validationErrors); // Set the errors in the state

    if (!validationErrors.name && !validationErrors.email && !validationErrors.password) {
      axios.post('http://localhost:8081/signup', values)
        .then(res => {
          if (res.data.status === "created") {
            alert("Signup successful!");
            navigate('/login');
          } else {
            alert("Signup failed. Please try again.");
          }
        })
        .catch(err => {
          console.error("Signup failed:", err);
          alert("Signup failed. Please try again.");
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
        <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              onChange={handleInput}
              className="form-control rounded-0"
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
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
            Signup
          </button>
          <p>You agree to our terms and conditions</p>
          <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;