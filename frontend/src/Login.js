import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate here
import axios from 'axios'; // Imported axios here
import './LoginValidation';
import Validation from './LoginValidation';
//rfce
function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate(); // Added useNavigate hook
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value })); // Corrected to store single value in an array
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values); // Corrected to use the validation errors from the function
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      axios
        .post('http://localhost:8081/login', values)
        .then((res) => {
          if (res.data.status === "success") {
            // Store the user's ID in localStorage for future reference
            localStorage.setItem('userId', res.data.userId);
            navigate('/dashboard');
          } else {
            alert('No record existed');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <div>
          <h2>Login</h2>
          <form action="" onSubmit={handleSubmit}>
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
              className="btn btn-default borde w-100 bg-light rounded-0 text-decoration-none"
            >
              Create Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;