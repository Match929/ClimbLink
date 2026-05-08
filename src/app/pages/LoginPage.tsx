import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Lock, Mail, Mountain } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic here
    console.log("Login with:", email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7eb662] to-[#6a9b54] flex flex-col">
      {/* Top Illustration Area */}
      <div className="flex-1 flex items-center justify-center px-6 pt-16 pb-8">
        <div className="text-center">
          {/* Logo */}
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Mountain className="w-14 h-14 text-white" strokeWidth={2} />
          </div>

          {/* App Name */}
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            ClimbConnect
          </h1>
          <p className="text-white/90 text-lg drop-shadow">
            Find Partners · Climb Together
          </p>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-2xl">
        <div className="max-w-sm mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to continue your climbing journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-11 h-12 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                  required
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#7eb662] hover:text-[#6a9b54] font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white font-semibold rounded-xl shadow-lg"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
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

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/register"
              className="text-[#7eb662] hover:text-[#6a9b54] font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
