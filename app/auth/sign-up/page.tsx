"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { authClient } from "@/lib/auth-client"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons"

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        callbackURL: "/",
      })

      if (error) {
        console.log("Signup error:", error)
        toast.error(error.message || "Signup failed. Please try again.")
        return
      }

      console.log("Signup successful:", data)

      toast.success("Account created successfully!")

      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Unexpected signup error:", err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-xl">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold">
          Hire<span className="text-blue-500">Loop</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Join HireLoop and find your next opportunity.
          </p>
        </div>

        <div className="mb-6">
          <GoogleAuthButton
            label="Sign up with Google"
            disabled={loading}
            requestSignUp
          />
        </div>

        <div className="mb-6 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-white/10" />
          <span>or sign up with email</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Account Type Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              Choose Your Role
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Job Seeker */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "seeker" })
                }
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition ${
                  formData.role === "seeker"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-white/10 bg-[#202020] text-gray-400 hover:border-white/30"
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="text-2xl" />
                <span className="text-sm font-medium">Seeker</span>
              </button>

              {/* Recruiter */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "recruiter" })
                }
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition ${
                  formData.role === "recruiter"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-white/10 bg-[#202020] text-gray-400 hover:border-white/30"
                }`}
              >
                <FontAwesomeIcon icon={faBuilding} className="text-2xl" />
                <span className="text-sm font-medium">Recruiter</span>
              </button>

            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-sm transition outline-none focus:border-indigo-500"
            />
          </div>

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
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-sm transition outline-none focus:border-indigo-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-sm transition outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
