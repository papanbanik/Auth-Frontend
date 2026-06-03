'use client'

import Image from "next/image"
import { useState, useContext, FormEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { AppContent } from "../context/AppContent"
import { assets } from "../assets/assets"

type AppContextType = {
  backendUrl: string
  loginUser: (email: string, password: string) => Promise<boolean>
  setIsLoggedin: (v: boolean) => void
  checkAuth: () => Promise<void>
}

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { backendUrl, loginUser, setIsLoggedin, checkAuth } =
    useContext(AppContent) as AppContextType

  // ---------------- GOOGLE LOGIN SUCCESS ----------------
 useEffect(() => {
  const token = searchParams.get("token")

  if (!token) return

  const handleGoogleLogin = async () => {
    localStorage.setItem("token", token)

    try {
      await checkAuth()   // 🔥 FIRST sync user
      toast.success("Google login successful")
      router.push("/")
    } catch {
      toast.error("Google login failed")
    }
  }

  handleGoogleLogin()
}, [])
  // ---------------- EMAIL LOGIN ----------------
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const success = await loginUser(email, password)

    setLoading(false)

    if (success) {
      router.push("/")
    }
  }

  // ---------------- GOOGLE LOGIN ----------------
  const googleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <Image src={assets.logo} alt="logo" className="w-28 mb-6" />

      <form
        onSubmit={handleLogin}
        className="bg-slate-900 w-96 p-10 rounded-lg"
      >
        <h2 className="text-white text-center text-2xl mb-3">
          Login
        </h2>

        <p className="text-indigo-300 text-center text-sm mb-4">
          Login to your account
        </p>

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
          className="bg-indigo-600 w-full p-2 text-white rounded-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-white mt-4 text-sm">
          Don&apos;t have account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-400 cursor-pointer"
          >
            Sign Up
          </span>
        </p>

        <div className="text-gray-400 text-center my-3">OR</div>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={googleLogin}
          className="w-full bg-white text-black py-3 rounded-full flex items-center justify-center gap-2"
        >
          <img
            src="https://img.icons8.com/?size=100&id=60984&format=png"
            className="w-5"
          />
          Continue with Google
        </button>
      </form>
    </div>
  )
}

export default Page