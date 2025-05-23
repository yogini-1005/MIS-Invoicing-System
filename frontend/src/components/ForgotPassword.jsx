import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data.message || "Password reset link sent to your email",
        {
          position: "top-right",
          autoClose: 5000, // Increased time to read the message
        }
      );
      // Removed immediate navigation to let user see the message
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link. Please try again.";
      toast.error(errMsg, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                  aria-live="polite"
                ></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="login-footer mt-3">
          <p>
            Remember your password? <Link to="/login">Login</Link>
          </p>
          <p className="mt-2">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}