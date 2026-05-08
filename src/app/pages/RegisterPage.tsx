import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Lock, Mail, User, Mountain } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    level: "",
  });

  const levels = [
    { value: "V0-V2", label: "Beginner", color: "bg-green-100 text-green-700" },
    { value: "V3-V5", label: "Intermediate", color: "bg-blue-100 text-blue-700" },
    { value: "V6-V8", label: "Advanced", color: "bg-purple-100 text-purple-700" },
    { value: "V9+", label: "Expert", color: "bg-orange-100 text-orange-700" },
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Register logic here
    console.log("Register with:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7eb662] to-[#6a9b54] flex flex-col">
      {/* Top Illustration Area */}
      <div className="flex items-center justify-center px-6 pt-12 pb-6">
        <div className="text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[24px] flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Mountain className="w-11 h-11 text-white" strokeWidth={2} />
          </div>

          {/* App Name */}
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Join ClimbConnect
          </h1>
          <p className="text-white/90 drop-shadow">
            Start your climbing adventure today
          </p>
        </div>
      </div>

      {/* Register Form Card */}
      <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-2xl overflow-y-auto">
        <div className="max-w-sm mx-auto">
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Fill in the information below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="pl-11 h-12 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="pl-11 h-12 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                  required
                />
              </div>
            </div>

            {/* Climbing Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Climbing Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, level: level.value })
                    }
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.level === level.value
                        ? "border-[#7eb662] bg-[#f0f7ec]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">
                      {level.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {level.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Create a password"
                  className="pl-11 pr-11 h-12 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm your password"
                  className="pl-11 h-12 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                  required
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-[#7eb662] border-gray-300 rounded focus:ring-[#7eb662]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <button type="button" className="text-[#7eb662] hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-[#7eb662] hover:underline">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white font-semibold rounded-xl shadow-lg mt-6"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Third-party Login */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xl">📱</span>
            </button>
            <button className="flex items-center justify-center h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xl">💬</span>
            </button>
            <button className="flex items-center justify-center h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xl">🍎</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-[#7eb662] hover:text-[#6a9b54] font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
