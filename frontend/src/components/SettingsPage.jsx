import { useState } from 'react'

export default function SettingsPage({ user, onLogout, onUpdateSettings }) {
  const [dailyGoal, setDailyGoal] = useState(user?.settings?.dailyGoal || 0)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onUpdateSettings({ dailyGoal: parseInt(dailyGoal) || 0 })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown'

  return (
    <div className="space-y-6">

      {/* Profile Card */}
      <div className="glass-card rounded-3xl p-6 text-center animate-fadeInUp relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-emerald-500/20 mb-4">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <p className="text-xl font-bold text-white">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <p className="text-xs text-slate-600 mt-2">Member since {memberSince}</p>
        </div>
      </div>

      {/* Daily Goal Setting */}
      <div className="animate-fadeInUp">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">🎯 Daily Goal</h2>
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <p className="text-sm text-slate-400">Set a maximum number of items per day. The dashboard will warn you when you approach or exceed this limit.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDailyGoal(Math.max(0, dailyGoal - 1))}
              className="w-12 h-12 rounded-2xl glass-card text-slate-300 text-xl font-bold hover:bg-slate-700/50 transition-colors flex items-center justify-center"
            >−</button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-black text-white">{dailyGoal}</span>
              <p className="text-xs text-slate-600 mt-1">{dailyGoal === 0 ? 'No limit set' : `items per day`}</p>
            </div>
            <button
              onClick={() => setDailyGoal(dailyGoal + 1)}
              className="w-12 h-12 rounded-2xl glass-card text-slate-300 text-xl font-bold hover:bg-slate-700/50 transition-colors flex items-center justify-center"
            >+</button>
          </div>
          <button
            onClick={handleSave}
            className={`w-full font-bold py-3 rounded-2xl transition-all duration-300 ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/15'
            }`}
          >
            {saved ? '✅ Saved!' : 'Save Goal'}
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="animate-fadeInUp">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">ℹ️ About</h2>
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <InfoRow label="App Version" value="2.0.0" />
          <div className="h-px bg-slate-800"></div>
          <InfoRow label="Stack" value="React + Vite + Express" />
          <div className="h-px bg-slate-800"></div>
          <InfoRow label="Database" value="JSON (Local)" />
          <div className="h-px bg-slate-800"></div>
          <InfoRow label="Created by" value={user?.name || 'You'} />
        </div>
      </div>

      {/* Logout & Danger Zone */}
      <div className="animate-fadeInUp space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">⚠️ Account</h2>
        <button
          onClick={onLogout}
          className="w-full glass-card rounded-2xl p-4 text-red-400 font-semibold hover:bg-red-500/10 hover:border-red-500/30 transition-all text-center"
        >
          ⏻ Sign Out
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="h-4"></div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-300 font-medium text-sm">{value}</span>
    </div>
  )
}
