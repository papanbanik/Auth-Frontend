"use client"

import { createContext, useEffect, useState, ReactNode } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

type UserData = {
  email?: string
  name?: string
  isAccountVerified?: boolean
}

type LoginErrorResponse = {
  success?: false
  message?: string
  code?: string
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

  // ================= REFRESH TOKEN =================
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await axios.post(
        `${backendUrl}/refresh`,
        {},
        { withCredentials: true } // ✅ cookie পাঠাবে
      )
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        return res.data.token
      }
      return null
    } catch {
      return null
    }
  }

  // ================= CHECK AUTH =================
  const checkAuth = async () => {
    try {
      const isLoggedOut = localStorage.getItem("logout") === "true"
      if (isLoggedOut) {
        setIsLoggedin(false)
        setUserData(null)
        setLoading(false)
        return
      }

      const token = getToken()
      if (!token) {
        setIsLoggedin(false)
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        const res = await axios.get(`${backendUrl}/data`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.data.success) {
          setUserData(res.data.uservalue)
          setIsLoggedin(true)
        } else {
          localStorage.removeItem("token")
          setUserData(null)
          setIsLoggedin(false)
        }
      } catch (err) {
        const error = err as AxiosError
        if (error.response?.status === 401) {
          // ✅ accessToken expire — refresh করো
          const newToken = await refreshAccessToken()
          if (newToken) {
            try {
              const retryRes = await axios.get(`${backendUrl}/data`, {
                headers: { Authorization: `Bearer ${newToken}` },
              })
              if (retryRes.data.success) {
                setUserData(retryRes.data.uservalue)
                setIsLoggedin(true)
                return
              }
            } catch {
              // retry ও fail — logout
            }
          }
        }
        localStorage.removeItem("token")
        setUserData(null)
        setIsLoggedin(false)
      }
    } finally {
      setLoading(false)
    }
  }

  // ================= LOGIN =================
  const loginUser = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${backendUrl}/login`, {
        email,
        password,
      }, {withCredentials: true})

      if (!res.data.success || !res.data.token) {
        toast.error(res.data.message || "Invalid credentials")
        return false
      }

      localStorage.setItem("token", res.data.token)
      localStorage.removeItem("logout")

      await checkAuth()

      return true
    } catch (err) {
      const error = err as AxiosError<LoginErrorResponse>
      const message = error.response?.data?.message
      toast.error(message || "Login failed")
      return false
    }
  }

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      const token = getToken()

      await axios.post(
        `${backendUrl}/logout`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true, // ✅ cookie clear হবে
        }
      )

      localStorage.removeItem("token")
      localStorage.setItem("logout", "true")

      setUserData(null)
      setIsLoggedin(false)

      toast.success("Logged out")
    } catch {
      toast.error("Logout failed")
    }
  }

  // ================= INITIAL AUTH CHECK =================
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