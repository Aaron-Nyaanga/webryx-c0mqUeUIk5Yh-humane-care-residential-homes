import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
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
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="https://img1.wsimg.com/isteam/ip/c4b9dfa8-0b20-4cbe-9ee1-c309928d05ca/humane-care-logo-eda3f87.png"
            alt="Humane Care Residential Homes"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  active ? 'text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={active ? { backgroundColor: '#4E8C52' } : {}}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{ backgroundColor: '#4E8C52' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to={user ? '/admin/dashboard' : '/admin/login'}
              className="ml-2 px-4 py-2 text-sm font-semibold rounded-lg text-white shadow-sm"
              style={{ backgroundColor: '#316B36' }}
            >
              {user ? 'Dashboard' : 'Sign In'}
            </Link>
          </motion.div>
        </nav>

        {/* Animated hamburger */}
        <button
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-[5px] rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block h-0.5 w-5 rounded-full origin-center"
            style={{ backgroundColor: '#4E8C52' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-5 rounded-full"
            style={{ backgroundColor: '#4E8C52' }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block h-0.5 w-5 rounded-full origin-center"
            style={{ backgroundColor: '#4E8C52' }}
          />
        </button>
      </div>

      {/* Mobile dropdown — AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <nav className="px-4 py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link, i) => {
                const active = pathname === link.to
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.to}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      style={active ? { backgroundColor: '#4E8C52' } : {}}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
              >
                <Link
                  to={user ? '/admin/dashboard' : '/admin/login'}
                  className="block mt-1 px-4 py-3 rounded-lg text-sm font-semibold text-white text-center"
                  style={{ backgroundColor: '#316B36' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {user ? 'Dashboard' : 'Sign In'}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
