'use client'

import { useState, useRef , useContext} from "react"
import Image from "next/image"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { assets } from "../assets/assets"
import { AppContent } from '../context/AppContent'

const Page = () => {

  const router = useRouter()
 const { backendUrl } = useContext(AppContent)

  const [otp, setOtp] = useState(new Array(6).fill(""))
  const inputRefs = useRef([])

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const finalOtp = otp.join("")

    if (finalOtp.length !== 6) {
      return toast.error("Enter 6 digit OTP")
    }

    try {
      const res = await axios.post(
        `${backendUrl}/verify-account`,
        { otp: String(finalOtp) },
        { withCredentials: true }
      )

      const data = res.data

      if (data.success) {
        toast.success(data.message || "Email verified successfully")
        router.push("/")
      } else {
        toast.error(data.message || "Verification failed")
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">

      <div className="w-96 bg-slate-900 p-10 rounded-lg">

        <h2 className="text-white text-center text-2xl font-semibold mb-2">
          Email Verify OTP
        </h2>

        <p className="text-center text-sm text-indigo-300 mb-6">
          Enter the 6 digit code sent to your email
        </p>

        <form onSubmit={handleSubmit}>

          <div className="flex justify-between gap-2 mb-6">

            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-white text-xl bg-[#333A5C] rounded-md outline-none"
              />
            ))}

          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-full"
          >
            Verify OTP
          </button>

        </form>

      </div>
    </div>
  )
}

export default Page