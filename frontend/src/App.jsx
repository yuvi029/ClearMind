import { useState, useEffect, useCallback } from 'react'
import LoginPage from './components/LoginPage'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import LogPage from './components/LogPage'
import History from './components/History'
import HealthPage from './components/HealthPage'
import SettingsPage from './components/SettingsPage'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [logs, setLogs] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendError, setBackendError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const savedUser = localStorage.getItem('clearmind_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setLoading(false)
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setBackendError(false)

    try {
      const [productsRes, logsRes, statsRes] = await Promise.all([
        fetch(`${API}/products`).then(r => r.json()),
        fetch(`${API}/logs/${encodeURIComponent(user.email)}`).then(r => r.json()),
        fetch(`${API}/stats/${encodeURIComponent(user.email)}`).then(r => r.json()),
      ])

      if (!Array.isArray(productsRes) || productsRes.length === 0) {
        setBackendError(true)
      } else {
        setProducts(productsRes)
        setLogs(logsRes)
        setStats(statsRes)
        setBackendError(false)
      }
    } catch (err) {
      console.error('Failed to load data:', err)
      setBackendError(true)
    }
    setLoading(false)
  }, [user, retryCount])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const refreshStats = async () => {
    try {
      const statsRes = await fetch(`${API}/stats/${encodeURIComponent(user.email)}`).then(r => r.json())
      setStats(statsRes)
    } catch (err) {
      console.error('Failed to refresh stats:', err)
    }
  }

  const handleLogin = (userData) => setUser(userData)

  const handleLogout = () => {
    localStorage.removeItem('clearmind_user')
    setUser(null)
    setLogs([])
    setProducts([])
    setStats(null)
    setBackendError(false)
    setCurrentPage('dashboard')
  }

  const handleLog = async (newLog) => {
    try {
      const res = await fetch(`${API}/logs/${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      })
      if (res.ok) {
        setLogs(prev => [...prev, newLog])
        refreshStats()
      }
    } catch (err) {
      console.error('Failed to save log:', err)
    }
  }

  const handleDelete = async (timestamp) => {
    try {
      const res = await fetch(`${API}/logs/${encodeURIComponent(user.email)}/${encodeURIComponent(timestamp)}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setLogs(prev => prev.filter(log => log.timestamp !== timestamp))
        refreshStats()
      }
    } catch (err) {
      console.error('Failed to delete log:', err)
    }
  }

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`${API}/logs/${encodeURIComponent(user.email)}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setLogs([])
        refreshStats()
      }
    } catch (err) {
      console.error('Failed to clear history:', err)
    }
  }

  const handleUpdateSettings = async (settings) => {
    try {
      const res = await fetch(`${API}/auth/settings/${encodeURIComponent(user.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        const updated = await res.json()
        setUser(updated)
        localStorage.setItem('clearmind_user', JSON.stringify(updated))
      }
    } catch (err) {
      console.error('Failed to update settings:', err)
    }
  }

  if (!user) return <LoginPage onLogin={handleLogin} />

  // Loading screen — shows while waking up Render
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/20 animate-pulse">
          🧠
        </div>
        <p className="text-slate-400 font-medium text-sm animate-pulse">Loading ClearMind...</p>
        <p className="text-slate-600 text-xs max-w-xs text-center">
          First load may take ~30 seconds while the server wakes up ☕
        </p>
      </div>
    )
  }

  // Backend error screen with retry button
  if (backendError) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center gap-5 p-6 text-center">
        <span className="text-5xl">😴</span>
        <p className="text-slate-300 font-bold text-xl">Server is waking up...</p>
        <p className="text-slate-500 text-sm max-w-xs">
          The backend takes ~30 seconds to start on the free plan. Click retry in a moment.
        </p>
        <button
          onClick={() => setRetryCount(c => c + 1)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95"
        >
          🔄 Retry
        </button>
        <button onClick={handleLogout} className="text-red-400 text-sm hover:underline">
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-50 font-sans">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} user={user} onLogout={handleLogout} />

      <main className="pt-16 pb-20 px-4 max-w-lg mx-auto">
        {currentPage === 'dashboard' && <Dashboard stats={stats} />}
        {currentPage === 'log' && <LogPage products={products} onLog={handleLog} />}
        {currentPage === 'history' && <History logs={logs} onDelete={handleDelete} onDeleteAll={handleDeleteAll} />}
        {currentPage === 'health' && <HealthPage user={user} />}
        {currentPage === 'settings' && <SettingsPage user={user} onLogout={handleLogout} onUpdateSettings={handleUpdateSettings} />}
      </main>

      <footer className="text-center text-slate-600 text-xs py-4">
        Created by Yuvraj with ❤️ — Stay Healthy 🌿
      </footer>
    </div>
  )
}

export default App