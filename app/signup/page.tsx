'use client'

import Image from "next/image"
import { useState, useContext } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContent'

const Page = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const { backendUrl, setIsLoggedin, getUserData } =
    useContext(AppContent)

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        `${backendUrl}/signup`,
        { name, email, password },
        { withCredentials: true }
      )

      if (data.success) {
        setIsLoggedin(true)
        await getUserData()
        toast.success(data.message)
        router.push('/')
      } else {
        toast.error(data.message || "Signup failed")
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Server error")
    }
  }

  const googleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`
  }

  return (
    <div>
      <Image src={assets.logo} alt="logo" className="w-28 p-4" />

      <form
        onSubmit={handleSignup}
        className="bg-slate-900 w-96 m-auto p-10 rounded-lg"
      >

        <h2 className="text-white text-center text-2xl font-semibold mb-2">
          Create Account
        </h2>

        <h2 className="text-center text-sm text-indigo-300 mb-6">
          Create your Account
        </h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-5 py-2.5 rounded-full bg-[#333A5C] text-white outline-none"
          required
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-5 py-2.5 rounded-full bg-[#333A5C] text-white outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-5 py-2.5 rounded-full bg-[#333A5C] text-white outline-none"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 w-full p-2 text-white rounded-full"
        >
          Sign Up
        </button>

        <p className="text-white mt-4 text-sm">
          Already have account?
          <span
            onClick={() => router.push('/login')}
            className="text-blue-400 cursor-pointer ml-2"
          >
            Login
          </span>
        </p>

        <button
          type="button"
          onClick={googleLogin}
          className="w-full mt-4 bg-white text-black py-2 rounded-full flex items-center justify-center gap-2"
        >
          <img
            src="https://img.icons8.com/?size=100&id=60984&format=png&color=000000"
            className="w-5"
          />
          Continue with Google
        </button>

      </form>
    </div>
  )
}

export default Page