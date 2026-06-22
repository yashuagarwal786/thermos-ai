'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://thermos-gateway-prod.onrender.com'
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const storeSessionAndRedirect = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('thermos_access_token', accessToken)
    localStorage.setItem('thermos_refresh_token', refreshToken)
    router.push('/dashboard')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.detail || 'Login failed')
        }
        const data = await res.json()
        setSuccessMsg('Successfully authenticated!')
        storeSessionAndRedirect(data.access_token, data.refresh_token)
      } else {
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: name }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.detail || 'Sign up failed')
        }
        setSuccessMsg('Account created successfully! Please sign in.')
        setIsLogin(true)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setErrorMsg('')
    if (!credentialResponse.credential) {
      setErrorMsg('Google sign-in did not return a credential')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Google sign-in failed')
      }
      const data = await res.json()
      setSuccessMsg('Successfully authenticated with Google!')
      storeSessionAndRedirect(data.access_token, data.refresh_token)
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display font-bold text-2xl text-white">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs text-gray-400">
          {isLogin ? 'Access your climate monitoring workspace' : 'Join the climate mitigation task force'}
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 text-center font-semibold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 text-center font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
              placeholder="Dr. Sarah Connor"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
            placeholder="climate@thermos.ai"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all mt-2 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <hr className="flex-grow border-white/5" />
        <span>or continue with</span>
        <hr className="flex-grow border-white/5" />
      </div>

      <div className="flex justify-center">
        {GOOGLE_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg('Google sign-in failed')}
              theme="filled_black"
              shape="pill"
              text={isLogin ? 'signin_with' : 'signup_with'}
            />
          </GoogleOAuthProvider>
        ) : (
          <p className="text-xs text-red-400">Google sign-in not configured (missing NEXT_PUBLIC_GOOGLE_CLIENT_ID)</p>
        )}
      </div>

      <div className="text-center text-xs text-gray-500">
        {isLogin ? "Don't have an account?" : "Already registered?"}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline font-semibold"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}
