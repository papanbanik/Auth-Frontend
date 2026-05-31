'use client'

import { createContext, useEffect, useState, ReactNode } from "react"
import axios from "axios"
import { toast } from "react-toastify"

type UserData = {
  email?: string
  name?: string
  [key: string]: unknown
}

type AppContextType = {
  backendUrl: string
  isLoggedin: boolean
  userData: UserData | null
  loading: boolean
  setIsLoggedin: (value: boolean) => void
  setUserData: (value: UserData | null) => void
  getUserData: () => Promise<void>
  loginUser: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AppContent = createContext<AppContextType | null>(null)

const AppContextProvider = ({ children }: { children: ReactNode }) => {

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

  const [isLoggedin, setIsLoggedin] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getUserData = async (): Promise<void> => {
    try {
      const res = await axios.get(`${backendUrl}/data`, {
        withCredentials: true,
      })

      if (res.data.success) {
        setUserData(res.data.uservalue)
        setIsLoggedin(true)
      } else {
        setUserData(null)
        setIsLoggedin(false)
      }
    } catch (error) {
      setUserData(null)
      setIsLoggedin(false)
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async (): Promise<void> => {
    try {
      const res = await axios.get(`${backendUrl}/is-auth`, {
        withCredentials: true,
      })

      if (res.data.success) {
        setIsLoggedin(true)
        await getUserData()
      } else {
        setIsLoggedin(false)
        setUserData(null)
      }
    } catch (error) {
      setIsLoggedin(false)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  const loginUser = async (email: string, password: string): Promise<void> => {
    try {
      const res = await axios.post(
        `${backendUrl}/login`,
        { email, password },
        { withCredentials: true }
      )

      if (res.data.success) {
        toast.success("Login successful")
        await checkAuth()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error("Login failed")
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const res = await axios.post(
        `${backendUrl}/logout`,
        {},
        { withCredentials: true }
      )

      if (res.data.success) {
        setUserData(null)
        setIsLoggedin(false)
        toast.success("Logged out")
      }
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  const handleGoogleToken = async (): Promise<void> => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (token) {
      localStorage.setItem("token", token)
      toast.success("Google login successful")

      window.history.replaceState({}, document.title, "/")

      await checkAuth()
    }
  }

useEffect(() => {
  const init = async () => {
    await checkAuth()
    await handleGoogleToken()
  }
  init()
}, [])

  const value: AppContextType = {
    backendUrl,
    isLoggedin,
    userData,
    loading,
    setIsLoggedin,
    setUserData,
    getUserData,
    loginUser,
    logout,
    checkAuth,
  }

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  )
}

export default AppContextProvider