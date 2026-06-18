import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API = 'http://localhost:5000/api'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isSignup ? `${API}/auth/signup` : `${API}/auth/login`
      const body = isSignup ? { name, email, password } : { email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      localStorage.setItem('clearmind_user', JSON.stringify(data))
      onLogin(data)
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm space-y-8 animate-fadeInUp relative z-10">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-float">
            <span className="text-5xl">🧠</span>
          </div>
          <div>
            <h1 className="text-4xl font-black gradient-text">ClearMind</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              {isSignup ? 'Begin your journey to a healthier life' : 'Welcome back, warrior'}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center animate-scaleIn">
            <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-2 animate-fadeInUp">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignup}
                className="w-full glass-card rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full glass-card rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              className="w-full glass-card rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform transition-all duration-300 active:scale-[0.98] text-lg mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Please wait...
              </span>
            ) : (
              isSignup ? '🚀 Create Account' : '→ Sign In'
            )}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-slate-500 text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsSignup(!isSignup); setError('') }}
            className="text-emerald-400 font-semibold ml-2 hover:text-emerald-300 transition-colors"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
