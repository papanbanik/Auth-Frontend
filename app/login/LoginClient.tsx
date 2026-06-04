"use client"

import Image from "next/image"
import { useState, useContext, FormEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { AppContent } from "../context/AppContent"
import { assets } from "../assets/assets"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const context = useContext(AppContent)

  if (!context) {
    throw new Error("AppContent provider is missing")
  }

  const { backendUrl, loginUser, setIsLoggedin, checkAuth } = context

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const token = searchParams.get("token")

  // ================= GOOGLE LOGIN =================
  useEffect(() => {
    if (!token || token.length < 10) return

    const isLoggedOut = localStorage.getItem("logout") === "true"

    if (isLoggedOut) {
      localStorage.removeItem("logout")
      return
    }

    const handleGoogleLogin = async () => {
      setGoogleLoading(true)

      try {
        localStorage.setItem("token", token)

        await checkAuth()
        setIsLoggedin(true)

        // clean URL (remove token from address bar)
        window.history.replaceState({}, "", "/login")

        toast.success("Google login successful")
        router.push("/")
      } catch (err) {
        toast.error("Google login failed")
      } finally {
        setGoogleLoading(false)
      }
    }

    handleGoogleLogin()
  }, [token])

  // ================= EMAIL LOGIN =================
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await loginUser(email, password)

      if (success) {
        toast.success("Login successful")
        router.push("/")
      } else {
        toast.error("Invalid credentials")
      }
    } catch {
      toast.error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  // ================= GOOGLE REDIRECT =================
  const googleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`
  }

  return (
    <>
     <Image src={assets.logo} alt="logo" className="w-28 p-4" />
    <div className="min-h-screen flex flex-col items-center justify-center">
     

      <form
        onSubmit={handleLogin}
        className="bg-slate-900 w-96 p-10 rounded-lg"
      >
        <h2 className="text-white text-center text-2xl mb-3">
          Login
        </h2>

        <input
          className="w-full mb-3 p-2 rounded bg-[#333A5C] text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-3 p-2 rounded bg-[#333A5C] text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="bg-indigo-600 w-full p-2 text-white rounded-full disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <p className="text-white mt-4 text-sm ">
          Don't have an account?
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-400  cursor-pointer ml-2"
          >
            Sign up
          </span>
        </p>

        <div className="text-gray-400 text-center my-3">OR</div>

        <button
          type="button"
          onClick={googleLogin}
          disabled={googleLoading}
          className="w-full bg-white text-black py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>
      </form>
    </div>
    </>
  )
}