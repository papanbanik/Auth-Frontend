"use client"

import Image from "next/image"
import { useState, useContext, FormEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios"

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

  const context = useContext(AppContent) as AppContextType

  const { backendUrl, loginUser, setIsLoggedin, checkAuth } = context

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ GOOGLE LOGIN SUCCESS HANDLER
useEffect(() => {
  const token = searchParams?.get("token")

  if (!token) return

  const handleGoogleLogin = async () => {
    try {
      localStorage.setItem("token", token)

      await checkAuth()
      setIsLoggedin(true)

      toast.success("Google login successful")
      router.push("/")
    } catch (err) {
      toast.error("Google login failed")
    }
  }

  handleGoogleLogin()
}, [searchParams, checkAuth, router, setIsLoggedin])
  // ✅ EMAIL LOGIN
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const success = await loginUser(email, password)

    setLoading(false)

    if (success) {
      router.push("/")
    }
  }

  // ✅ GOOGLE LOGIN REDIRECT
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

        <div className="text-gray-400 text-center my-3">OR</div>

        <button
          type="button"
          onClick={googleLogin}
          className="w-full bg-white text-black py-3 rounded-full flex items-center justify-center gap-2"
        >
          Continue with Google
        </button>
      </form>
    </div>
  )
}

export default Page