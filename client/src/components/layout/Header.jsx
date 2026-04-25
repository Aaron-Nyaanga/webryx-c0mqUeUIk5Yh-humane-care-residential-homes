import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Careers', to: '/careers' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="https://img1.wsimg.com/isteam/ip/c4b9dfa8-0b20-4cbe-9ee1-c309928d05ca/humane-care-logo-eda3f87.png"
            alt="Humane Care Residential Homes"
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{ color: '#387A74' }}
              className={`font-medium transition-all hover:underline ${
                pathname === link.to ? 'underline font-semibold' : ''
              }`}
              aria-current={pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={user ? '/admin/dashboard' : '/admin/login'}
            style={{ color: '#387A74' }}
            className="font-semibold transition-all hover:underline"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="block w-6 h-0.5 bg-[#499D95]"></span>
          <span className="block w-6 h-0.5 bg-[#499D95]"></span>
          <span className="block w-6 h-0.5 bg-[#499D95]"></span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-white px-4 pb-4 flex flex-col gap-3 border-t border-gray-100" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{ color: '#387A74' }}
              className={`font-medium hover:underline transition-all ${
                pathname === link.to ? 'underline font-semibold' : ''
              }`}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
