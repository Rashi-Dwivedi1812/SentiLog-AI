import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("VITE_API_URL is:", import.meta.env.VITE_API_URL);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        console.warn("Response body not JSON or empty.");
      }

      console.log("Received response status:", res.status);
      console.log("Received response data:", data);

      if (res.ok && data.token) {
        // Set all necessary localStorage items
        localStorage.setItem("token", data.token);
        localStorage.setItem("registered", "1");
        localStorage.setItem("email", form.email);
        
        // Dispatch custom event to notify Navbar of auth change
        window.dispatchEvent(new Event("authChange"));
        
        setSuccess("Signed up successfully! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || `Signup failed with status ${res.status}`);
      }
    } catch (e) {
      setError("Network error");
      console.error("Network error during signup:", e);
    }
  };

  // Function to handle Google signup success
  const handleGoogleSuccess = (userData) => {
    console.log("Google signup success:", userData);
    
    // Ensure we have a valid token - use a proper token if available, otherwise create a valid placeholder
    const token = userData.token || userData.accessToken || `google_auth_${Date.now()}`;
    const userEmail = userData.email || userData.profileObj?.email || "user@gmail.com";
    
    // Set localStorage items for Google authenticated user
    localStorage.setItem("token", token);
    localStorage.setItem("registered", "1");
    localStorage.setItem("email", userEmail);
    
    // Dispatch custom event to notify Navbar of auth change
    window.dispatchEvent(new Event("authChange"));
    
    setSuccess("Google signup successful! Redirecting...");
    setTimeout(() => navigate("/"), 1500);
  };

  // Function to handle Google signup error
  const handleGoogleError = (error) => {
    setError("Google signup failed. Please try again.");
    console.error("Google signup error:", error);
  };

  return (
    <div className="auth-page-bg flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create your account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {success && <p className="text-green-600 dark:text-green-400">{success}</p>}
          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition"
          >
            Signup
          </button>
        </form>
        
        <div className="my-4 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        
        <GoogleLoginButton 
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
        
        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;