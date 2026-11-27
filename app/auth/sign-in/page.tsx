
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { GoogleAuthButton } from "@/components/google-auth-button";

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.log("Login error:", error);
        toast.error(error.message || "Invalid email or password!");
        return;
      }

      console.log("Login successful:", data);

      toast.success("Welcome back! Login successful.");

      // Redirect to homepage after successful login
      router.replace("/");
      router.refresh();

    } catch (err) {
      console.error("Unexpected login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-xl">

        <Link href="/" className="mb-8 block text-center text-2xl font-bold">
          Hire<span className="text-blue-600">Loop</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue your journey with HireLoop.
          </p>
        </div>

        <div className="mb-6">
          <GoogleAuthButton label="Continue with Google" disabled={loading} />
        </div>

        <div className="mb-6 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-white/10" />
          <span>or sign in with email</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-sm transition outline-none focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>

              <Link
                href="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 pr-12 text-sm transition outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 py-3 font-semibold transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-gray-400">
          Do not have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </main>
  );
}
