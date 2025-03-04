import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios for API requests
import './Signup.css'; // Adjust the path as needed
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    userName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    userRole: "customer", // Default value for the role
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!checked) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/user", formData);
      setSuccess("Signup successful! You can now log in. Response: ${response.status} - ${response.statusText}");
      setError("");
      console.log("Response Data:", response.data);
      console.log("Form Data:", formData);
    } catch (err) {
      console.error("Error Response:", err.response);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="signup-body">
      <div className="signup-container">
        <img src="logo.png" alt="Logo" className="logo" />
        <h2>Sign Up</h2>
        <h3>Create an account to login</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Firstname"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="secondName"
            placeholder="Secondname"
            value={formData.secondName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="emailAddress"
            placeholder="Email"
            value={formData.emailAddress}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Contact"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          <input
            type="text"
            name="userRole"
            placeholder="Role"
            value={formData.userRole}
            onChange={handleChange}
            required
          />

          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
            label="I agree to the terms and conditions"
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <p>
            Have an account?{" "}
            <span id="que">
              <Link to="/">Login</Link>
            </span>
          </p>
          <button className="button-signup" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
