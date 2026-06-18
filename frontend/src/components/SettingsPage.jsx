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
    <div className="space-y-4 pb-2">

      {/* Profile Card */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 p-5 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-emerald-500/20 mb-3">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <p className="text-lg font-bold text-white">{user?.name}</p>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <p className="text-xs text-slate-600 mt-1">Member since {memberSince}</p>
      </div>

      {/* Daily Goal */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-0.5">Daily Goal</p>
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 p-4 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            Set a daily limit. You'll be warned on the dashboard when you approach or exceed it.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDailyGoal(Math.max(0, dailyGoal - 1))}
              className="w-11 h-11 rounded-xl bg-slate-700/60 border border-slate-600/40 text-slate-300 text-xl font-bold hover:bg-slate-600/60 transition-colors flex items-center justify-center"
            >−</button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-black text-white">{dailyGoal}</span>
              <p className="text-xs text-slate-600 mt-0.5">{dailyGoal === 0 ? 'No limit set' : 'items per day'}</p>
            </div>
            <button
              onClick={() => setDailyGoal(dailyGoal + 1)}
              className="w-11 h-11 rounded-xl bg-slate-700/60 border border-slate-600/40 text-slate-300 text-xl font-bold hover:bg-slate-600/60 transition-colors flex items-center justify-center"
            >+</button>
          </div>
          <button
            onClick={handleSave}
            className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ${
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
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-0.5">About</p>
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 divide-y divide-slate-700/40">
          <InfoRow label="Version" value="2.0.0" />
          <InfoRow label="Stack" value="React + Vite + Express" />
          <InfoRow label="Database" value="JSON (Local)" />
          <InfoRow label="Built by" value="Yuvraj" />
        </div>
      </div>

      {/* Sign Out */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-0.5">Account</p>
        <button
          onClick={onLogout}
          className="w-full rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30 p-4 text-red-400 font-semibold transition-all text-center"
        >
          Sign Out
        </button>
      </div>

    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-300 font-medium text-sm">{value}</span>
    </div>
  )
}