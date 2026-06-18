import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import useAuthStore from "../store/AuthStore";
import AuthNavbar from "../components/AuthNavbar";
import Logo from "../components/Logo";

function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login,signup, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // If already logged in, go to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

const handleChange = (e) =>{
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
      if (mode === "signup") {
        // POST /api/signup — body: { username, email, password }
       signup(form)
        // After signup, auto-login
       
        navigate("/");
      } else {
        // POST /api/login — body: { email, password }
        login(form);
        navigate("/dashboard");
      }
    
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <AuthNavbar />

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-8">

              {/* Top icon + title */}
              <div className="flex flex-col items-center mb-6">
                <Logo size={52} />
                <h1
                  className="text-2xl font-extrabold mt-3 tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {mode === "login" ? "Welcome back 👋" : "Create your account"}
                </h1>
                <p className="text-sm text-base-content/50 mt-1">
                  {mode === "login"
                    ? "Sign in to continue your interview prep"
                    : "Start your interview preparation journey"}
                </p>
              </div>

              {/* Toggle tabs */}
              <div className="tabs tabs-boxed mb-6 bg-base-200 flex-row justify-around">
                
                <button
                  className={`tab flex-1 font-semibold ${mode === "login" ? "tab-active bg-amber-50" : ""} ${mode=='login'?'text-primary':'text-base-content/70 hover:text-base-content'}`}
                  onClick={() => switchMode("login")}
                >
                  Sign In
                </button>

                
                
                <button
                  className={`tab   flex-1 font-semibold ${mode === "signup" ? "tab-active  bg-amber-50 " : "tab-active"}${mode=='signup'?'text-primary':'text-base-content/70 hover:text-base-content hover:text-blue-600"'}`}
                  onClick={() => switchMode("signup")}
                >
                  Sign Up
                </button>

                
              </div>

              {/* Error alert */}
              {error && (
                <div className="alert alert-error mb-4 py-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username — only for signup */}
                {mode === "signup" && (
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-semibold">Username</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="e.g. john_dev"
                      required
                      className="input input-bordered w-full focus:input-primary"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="input input-bordered w-full focus:input-primary"
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="input input-bordered w-full focus:input-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full mt-2 font-bold text-base"
                >
                  {loading && <span className="loading loading-spinner loading-sm"></span>}
                  {loading
                    ? "Please wait…"
                    : mode === "login" ? "Sign In →" : "Create Account →"}
                </button>
              </form>

              {/* Switch mode link */}
              <p className="text-center text-sm text-base-content/50 mt-5">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  className="text-primary font-semibold hover:underline"
                  onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Features strip below card */}
          <div className="flex justify-center gap-6 mt-6 flex-wrap">
            {["🧠 Technical", "💬 HR / Behavioral", "💻 Coding", "📊 AI Feedback"].map((f) => (
              <span key={f} className="badge badge-soft badge-primary text-sm px-3 py-2">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;