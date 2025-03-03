// SignupValidation.js
function Validation(values) {
    let error = {};
  
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
    if (!values.name.trim()) {
      error.name = "Name should not be empty";
    }
  
    if (!values.email.trim()) {
      error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
      error.email = "Invalid email format";
    }
  
    if (!values.password.trim()) {
      error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
      error.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, and a number";
    }
  
    return error;
  }
  
  export default Validation;
  