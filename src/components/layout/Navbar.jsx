import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const NAV_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/news',        label: 'News' },
  { to: '/scholars',    label: 'Scholars' },
  { to: '/scholarships',label: 'Scholarships' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, signOut, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-maroon/95 backdrop-blur-md border-b border-gold/20 shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/logo.PNG" alt="KERIS logo" className="w-10 h-10 object-contain" />
          </div>
          <span
            style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800, fontSize: 30 }}
          >
            KERIS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 font-spartan text-sm font-600 tracking-wide uppercase transition-colors duration-200 ${
                  isActive
                    ? 'text-gold'
                    : 'text-cream/70 hover:text-gold'
                }`
              }
              style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 600 }}
            >
              {label}
            </NavLink>
          ))}

          {user && (
            <>
              <NavLink
                to="/resume"
                className={({ isActive }) =>
                  `px-4 py-2 font-spartan text-sm font-600 tracking-wide uppercase transition-colors ${
                    isActive ? 'text-gold' : 'text-cream/70 hover:text-gold'
                  }`
                }
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 600 }}
              >
                Resume
              </NavLink>
              <NavLink
                to="/essay"
                className={({ isActive }) =>
                  `px-4 py-2 font-spartan text-sm font-600 tracking-wide uppercase transition-colors ${
                    isActive ? 'text-gold' : 'text-cream/70 hover:text-gold'
                  }`
                }
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 600 }}
              >
                Essay
              </NavLink>
            </>
          )}

        </div>

        {/* Auth buttons */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <span className="text-cream/50 text-sm font-times">
              {profile?.email || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="btn-outline text-xs py-2 px-4"
            >
              Sign out
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-gold transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gold transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gold transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-maroon/98 border-t border-gold/20 px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `py-2 font-spartan text-sm font-600 tracking-wide uppercase ${
                  isActive ? 'text-gold' : 'text-cream/70'
                }`
              }
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <>
              <NavLink to="/resume" onClick={() => setMenuOpen(false)} className="py-2 font-spartan text-sm text-cream/70" style={{ fontFamily: "'League Spartan', sans-serif" }}>Resume</NavLink>
              <NavLink to="/essay"  onClick={() => setMenuOpen(false)} className="py-2 font-spartan text-sm text-cream/70" style={{ fontFamily: "'League Spartan', sans-serif" }}>Essay</NavLink>
              <button onClick={handleSignOut} className="mt-2 btn-outline w-full text-center text-xs">Sign out</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
