import React, { useState } from "react";
import { SignInForm } from "../components/SignInForm";
import { SignUpForm } from "../components/SignUpForm";
import Logo from '../download.png'
import "./Auth.css";

export default function AuthSystem() {
  const [currentForm, setCurrentForm] = useState("signin");

  const handleSignIn = (token) => {
    //console.log("Login successful with token:", token);
    // Here you can redirect to another page if you want:
     window.location.href = "/protected";
   
  };

  const handleSignUp = (userData) => {
    console.log("Registration successful:", userData);
    // Switch to sign in form after successful registration
    setTimeout(() => {
      setCurrentForm("signin");
    }, 3000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-branding">
        <div className="logo-container">
          <div className="agency-logo">
            <img src={Logo} alt="Office of the Data Protection Commissioner Kenya" />
          </div>
          <h1 className="agency-title">Data Protection Commissioner</h1>
          <p className="agency-subtitle">
            Republic of Kenya • Secure Portal Access
          </p>
        </div>

        <ul className="security-features">
          <li>End-to-end encryption</li>
          <li>Multi-factor authentication</li>
          <li>Audit trail logging</li>
          <li>GDPR compliant</li>
          <li>24/7 security monitoring</li>
        </ul>
      </div>

      <div className="auth-form-container">
        <div className="form-header">
          <div className="form-toggle">
            <button
              type="button"
              className={`toggle-button ${
                currentForm === "signin" ? "active" : ""
              }`}
              onClick={() => setCurrentForm("signin")} 
            >
              Sign In
            </button>
            <button
              type="button"
              className={`toggle-button ${
                currentForm === "signup" ? "active" : ""
              }`}
              onClick={() => setCurrentForm("signup")} 
            >
              Register
            </button>
          </div>

          <h2 className="form-title">
            {currentForm === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="form-description">
            {currentForm === "signin"
              ? "Sign in to access your data protection dashboard and manage compliance activities."
              : "Create your account to gain access to the Data Protection Commissioner's secure portal."}
          </p>
        </div>

        {currentForm === "signin" ? (
          <SignInForm onSubmit={handleSignIn} />
        ) : (
          <SignUpForm onSubmit={handleSignUp} />
        )}

      </div>
    </div>
  )
}
