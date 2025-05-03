import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";

function Login() {
  const navigate = useNavigate();
  const direction = sessionStorage.getItem("pageTransition") || "right";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    return () => sessionStorage.removeItem("pageTransition");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear general login error when user modifies form
    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Here you would normally make an API call to authenticate
    try {
      // Demo login logic - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // If login successful:
      navigate("/dashboard");
    } catch (error) {
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition direction={direction}>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome Back</h1>
        <div className="w-full max-w-md">
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{loginError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <TextInput 
                id="email" 
                name="email" 
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <TextInput 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex justify-center">
              <Button 
                type="submit" 
                variant="primary" 
                size="medium" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;