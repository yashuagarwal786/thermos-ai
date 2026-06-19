'use client'

import { useState } from 'react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(isLogin ? "Successfully authenticated!" : "Account created successfully!")
    setTimeout(() => {
      setSuccessMsg('')
    }, 3000)
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
          className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all mt-2"
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <hr className="flex-grow border-white/5" />
        <span>or continue with</span>
        <hr className="flex-grow border-white/5" />
      </div>

      <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white font-semibold flex items-center justify-center gap-2 transition-all">
        <span className="text-sm">🔑</span> OAuth Provider Sign In
      </button>

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
