import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", form, {
        withCredentials: true,
      });

      toast.success(`Welcome ${res.data.full_name}`, {
        position: "top-right",
        autoClose: 3000,
      });

      setUser({
        role: res.data.role,
        email: res.data.email,
        full_name: res.data.full_name,
      });

      navigate("/dashboard");
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        "Invalid email or password. Please try again.";
      setError(errMsg);
      toast.error(errMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const forgotPasswordLink = document.querySelector(
      'a[href="/forgot-password"]'
    );
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("/forgot-password");
      });
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="email"
              placeholder="your@email.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/forgot-password"
              className="text-muted small"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
