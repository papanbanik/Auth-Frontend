'use client'

import Image from "next/image"
import { useState, useContext, useEffect, FormEvent } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { AppContent } from "../context/AppContent"
import { assets } from "../assets/assets"
import { AxiosError } from "axios"

type AppContextType = {
  backendUrl: string
  getUserData: () => Promise<void> | void
}

const Page = () => {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [googleMode, setGoogleMode] = useState<boolean>(false)

  // ✅ FIX: prevent TS error (context may be null/unknown)
  const { backendUrl, getUserData } = useContext(AppContent) as AppContextType

  useEffect(() => {
    getUserData()
  }, [])

  const googleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`
  }

  // ✅ FIX: proper event type
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        `${backendUrl}/login`,
        { email, password },
        { withCredentials: true }
      )

      if (data.success) {
        toast.success(data.message)
        await getUserData()
        router.push("/")
      } else {
        toast.error(data.message)

        if (
          data.message === "Google account detected. Please login with Google"
        ) {
          setGoogleMode(true)
        }
      }
    } 
  catch (error) {
  const err = error as AxiosError<{ message: string }>

  toast.error(err.response?.data?.message || "Server error")
}
  }

  return (
    <div>
      <div>
        <Image src={assets.logo} alt="logo" className="w-28 p-4" />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center">
        {googleMode ? (
          <div className="bg-slate-900 p-8 rounded-xl w-96 text-center">
            <h2 className="text-white text-xl font-semibold mb-3">
              Google Account Detected
            </h2>

            <p className="text-gray-300 text-sm mb-6">
              Please continue with Google login.
            </p>

            <button
              onClick={googleLogin}
              className="w-full bg-white text-black py-2 rounded-full flex items-center justify-center gap-2"
            >
              <img src="/google.png" className="w-5" />
              Continue with Google
            </button>

            <button
              onClick={() => setGoogleMode(false)}
              className="mt-3 text-sm text-indigo-300"
            >
              Try manual login again
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            className="bg-slate-900 w-96 p-10 rounded-lg"
          >
            <h2 className="text-white text-center text-2xl mb-3">
              Login
            </h2>

            <p className="text-indigo-300 text-center text-sm mb-4">
              Login your account
            </p>

            <input
              className="w-full mb-3 p-2 rounded bg-[#333A5C] text-white"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full mb-3 p-2 rounded bg-[#333A5C] text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="bg-indigo-600 w-full p-2 text-white rounded-full cursor-pointer">
              Login
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

            <div className="text-gray-400 text-center mb-3 mt-4">OR</div>

            <button
              type="button"
              onClick={googleLogin}
              className="w-full mb-4 bg-white text-black py-3 cursor-pointer rounded-full flex items-center justify-center gap-2"
            >
              <img
                src="https://img.icons8.com/?size=100&id=60984&format=png&color=000000"
                className="w-5"
              />
              Continue with Google
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Page