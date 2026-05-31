'use client'

import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContent = createContext()

const AppContextProvider = ({ children }) => {

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

  const [isLoggedin, setIsLoggedin] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUserData = async () => {
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

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${backendUrl}/is-auth`, {
        withCredentials: true,
      })

      if (res.data.success) {
        setIsLoggedin(true)
        getUserData()
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

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/login`, {
        email,
        password
      }, {
        withCredentials: true
      })

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

  const logout = async () => {
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

  const handleGoogleToken = async () => {
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
    checkAuth()
    handleGoogleToken()
  }, [])

  const value = {
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