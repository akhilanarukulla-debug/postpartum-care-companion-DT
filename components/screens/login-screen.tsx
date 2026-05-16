"use client"

import { useState } from "react"
import { Heart, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { BackgroundPattern } from "@/components/background-pattern"

interface LoginScreenProps {
  onLogin: (email: string, password: string, isSignup: boolean) => Promise<{ success: boolean; error?: string }>
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const result = await onLogin(email, password, !isLogin)
      if (!result.success) {
        setError(result.error || "Authentication failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <BackgroundPattern />
      
      {/* Logo and Welcome */}
      <div className="text-center mb-10 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-[#E8CFCF] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Heart className="w-10 h-10 text-[#5A4545]" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2 text-balance">
          Postpartum Care Companion
        </h1>
        <p className="text-muted-foreground text-sm">
          Your supportive wellness journey begins here
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm bg-card rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <h2 className="text-lg font-medium text-center mb-6">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-[#E8CFCF]/30 border border-[#E8CFCF] rounded-xl text-sm text-[#5A4545] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] transition-all"
              required
              minLength={6}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && (
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#E8CFCF] text-[#5A4545] rounded-xl font-medium hover:bg-[#E0C5C5] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              isLogin ? "Sign in" : "Create account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "New here? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              className="text-[#5A4545] font-medium hover:underline"
              disabled={isLoading}
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Supportive message */}
      <p className="mt-8 text-sm text-muted-foreground text-center max-w-xs animate-in fade-in duration-500 delay-300">
        We&apos;re here to support you on your postpartum journey
      </p>
    </div>
  )
}
