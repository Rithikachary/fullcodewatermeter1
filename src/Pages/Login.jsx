import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios"; // Import axios
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error state
    
    try {
      const response = await axios.post("http://14.195.14.194:8081/auth/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      // Debug log to see the data
      console.log("Login response:", response.data);

      if (response.status === 200 && response.data.access_token) {
        // Save token in localStorage
        localStorage.setItem("authToken", response.data.access_token);
        console.log("Token saved in localStorage:", response.data.access_token); // Log to verify the token
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error("Error during login:", error);
      setError(error.response ? error.response.data.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // For sending data (POST request) with the auth token
  const sendData = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    try {
      const response = await axios.post("http://14.195.14.194:8081/auth/login", {
        key: "value",
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        }
      });

      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="text"
            placeholder="Username/Email"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
                   <p>
                     Don't have an account...?{" "}
                     <span id="que">
                       <Link to="/signup">SignUp</Link>
                     </span>
                   </p>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
