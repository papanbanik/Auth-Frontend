"use client"

import { createContext, useEffect, useState, ReactNode } from "react"
import axios from "axios"
import { toast } from "react-toastify"

type UserData = {
  email?: string
  name?: string
  isAccountVerified?: boolean
}

type AppContextType = {
  backendUrl: string
  isLoggedin: boolean
  userData: UserData | null
  loading: boolean
  setIsLoggedin: (v: boolean) => void
  setUserData: (v: UserData | null) => void
  loginUser: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AppContent = createContext<AppContextType | null>(null)

export default function AppContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

  const [isLoggedin, setIsLoggedin] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null

 const checkAuth = async () => {
  try {
    const token = getToken()

    if (!token) {
      setIsLoggedin((prev) => {
        if (prev === false) return prev
        return false
      })

      setUserData((prev) => {
        if (prev === null) return prev
        return null
      })

      return
    }

    const res = await axios.get(`${backendUrl}/data`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.data.success) {
      setUserData((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(res.data.uservalue)) {
          return prev
        }
        return res.data.uservalue
      })

      setIsLoggedin((prev) => {
        if (prev === true) return prev
        return true
      })
    } else {
      localStorage.removeItem("token")
      setUserData(null)
      setIsLoggedin(false)
    }
  } catch {
    localStorage.removeItem("token")
    setUserData(null)
    setIsLoggedin(false)
  } finally {
    setLoading(false)
  }
}

  // ✅ LOGIN
  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post(`${backendUrl}/login`, {
        email,
        password,
      })

      if (!res.data.success || !res.data.token) {
        toast.error(res.data.message || "Invalid credentials")
        return false
      }

      localStorage.setItem("token", res.data.token)

      toast.success("Login successful")

      await checkAuth()

      return true
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed")
      } else {
        toast.error("Login failed")
      }
      return false
    }
  }

  // ✅ LOGOUT
  const logout = async () => {
    try {
      const token = getToken()

      await axios.post(
        `${backendUrl}/logout`,
        {},
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      )

      localStorage.removeItem("token")
      setUserData(null)
      setIsLoggedin(false)

      toast.success("Logged out")
    } catch {
      toast.error("Logout failed")
    }
  }

 useEffect(() => {
  let mounted = true

  const run = async () => {
    if (mounted) await checkAuth()
  }

  run()

  return () => {
    mounted = false
  }
}, [])

  return (
    <AppContent.Provider
      value={{
        backendUrl,
        isLoggedin,
        userData,
        loading,
        setIsLoggedin,
        setUserData,
        loginUser,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AppContent.Provider>
  )
}