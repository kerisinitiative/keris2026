import { useState } from 'react'

const PASSWORD = 'kerisdagoat'
const SESSION_KEY = 'keris_admin_auth'

export default function AdminGate({ children }) {
  const [authed, setAuthed]   = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [input, setInput]     = useState('')
  const [error, setError]     = useState(false)

  if (authed) return children

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-10 w-full max-w-sm" style={{ borderRadius: 0, borderTop: '3px solid #E6A122' }}>
        <h1
          className="text-2xl font-900 text-cream mb-1"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 900 }}
        >
          Admin Access
        </h1>
        <p className="text-cream/40 font-times text-sm mb-8">Enter the password to continue.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            className="keris-input"
          />
          {error && (
            <p className="text-red-400 text-xs font-times -mt-2">Incorrect password.</p>
          )}
          <button type="submit" className="btn-primary justify-center">
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
