"use client"

import { useState } from "react"
import { LoginForm } from "@/components/LoginForm"
import Leads from "@/components/Leads"

export default function LeadsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleLogin = (email: string, password: string) => {
    if (email === "admin@snout.com" && password === "password") {
      setIsAuthenticated(true)
      setLoginError("")
    } else {
      setLoginError("Invalid email or password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setLoginError("")
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="./assets/logo.png" alt="Snout Logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold text-gray-900">Snout Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Logout
          </button>
        </div>
      </div>
      <Leads />
    </div>
  )
}
