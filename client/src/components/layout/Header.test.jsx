/**
 * Header.test.jsx
 * QA tests for the Phase 10 header redesign:
 *   - White background, teal nav text, teal hamburger bars
 *   - Sign In / Dashboard button (solid teal fill)
 *   - Mobile dropdown on white background
 *   - Active link distinction
 *   - aria attributes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../firebase/config', () => ({
  auth: {},
  db: {},
  storage: {},
}))

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, cb) => { cb(null); return () => {} }),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(),
}))

// AuthContext mock — default: logged out
const mockUseAuth = vi.fn()
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderHeader(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Header />
    </MemoryRouter>
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Header — background & structure', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null })
  })

  it('renders the header element', () => {
    renderHeader()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('header has white background class (bg-white)', () => {
    renderHeader()
    const header = screen.getByRole('banner')
    expect(header.className).toContain('bg-white')
  })

  it('header has bottom border class (border-b)', () => {
    renderHeader()
    const header = screen.getByRole('banner')
    expect(header.className).toContain('border-b')
  })

  it('header has shadow-sm class', () => {
    renderHeader()
    const header = screen.getByRole('banner')
    expect(header.className).toContain('shadow-sm')
  })

  it('header does NOT have the old teal background (#499D95 inline style)', () => {
    renderHeader()
    const header = screen.getByRole('banner')
    expect(header.getAttribute('style') || '').not.toContain('499D95')
  })
})

describe('Header — logo', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null })
  })

  it('renders the logo image with correct alt text', () => {
    renderHeader()
    const logo = screen.getByAltText('Humane Care Residential Homes')
    expect(logo).toBeInTheDocument()
  })

  it('logo has h-16 class (increased from h-14)', () => {
    renderHeader()
    const logo = screen.getByAltText('Humane Care Residential Homes')
    expect(logo.className).toContain('h-16')
  })

  it('logo does NOT still have the old h-14 class', () => {
    renderHeader()
    const logo = screen.getByAltText('Humane Care Residential Homes')
    expect(logo.className).not.toMatch(/\bh-14\b/)
  })
})

describe('Header — desktop nav link colours', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null })
  })

  it('all nav links use the dark-teal inline colour (#387A74 / rgb(56,122,116))', () => {
    renderHeader()
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    // Grab only anchor links inside the desktop nav (excludes the Sign In button)
    const links = Array.from(nav.querySelectorAll('a[style]'))
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      // jsdom normalises hex to rgb, so check both forms
      const style = link.getAttribute('style') || ''
      const hasTeal =
        style.includes('387A74') ||
        style.includes('387a74') ||
        style.includes('rgb(56, 122, 116)') ||
        style.includes('rgb(56,122,116)')
      expect(hasTeal).toBe(true)
    })
  })

  it('plain nav links (not the Sign In button) do NOT use text-white class', () => {
    renderHeader()
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    // The Sign In/Dashboard button legitimately uses text-white (white on teal fill).
    // Only check the plain nav links that carry an inline color style.
    const plainLinks = Array.from(nav.querySelectorAll('a[style]'))
    expect(plainLinks.length).toBeGreaterThan(0)
    plainLinks.forEach((link) => {
      expect(link.className).not.toContain('text-white')
    })
  })
})

describe('Header — Sign In / Dashboard button', () => {
  it('shows "Sign In" when user is logged out', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderHeader()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows "Dashboard" when user is logged in', () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'admin-001' } })
    renderHeader()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('Sign In button has solid teal background (bg-[#499D95])', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderHeader()
    const btn = screen.getByRole('link', { name: /sign in/i })
    expect(btn.className).toContain('bg-[#499D95]')
  })

  it('Sign In button has text-white (white text on teal fill is correct)', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderHeader()
    const btn = screen.getByRole('link', { name: /sign in/i })
    expect(btn.className).toContain('text-white')
  })

  it('Sign In button has hover:bg-[#387A74] for hover state', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderHeader()
    const btn = screen.getByRole('link', { name: /sign in/i })
    expect(btn.className).toContain('hover:bg-[#387A74]')
  })

  it('Sign In button links to /admin/login when logged out', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderHeader()
    const btn = screen.getByRole('link', { name: /sign in/i })
    expect(btn.getAttribute('href')).toBe('/admin/login')
  })

  it('Dashboard button links to /admin/dashboard when logged in', () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'admin-001' } })
    renderHeader()
    const btn = screen.getByRole('link', { name: /dashboard/i })
    expect(btn.getAttribute('href')).toBe('/admin/dashboard')
  })
})

describe('Header — active nav link', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null })
  })

  it('active link has underline class', () => {
    renderHeader('/about')
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    const aboutLink = Array.from(nav.querySelectorAll('a')).find(
      (a) => a.textContent === 'About Us'
    )
    expect(aboutLink).toBeDefined()
    expect(aboutLink.className).toContain('underline')
  })

  it('active link has font-semibold class', () => {
    renderHeader('/about')
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    const aboutLink = Array.from(nav.querySelectorAll('a')).find(
      (a) => a.textContent === 'About Us'
    )
    expect(aboutLink.className).toContain('font-semibold')
  })

  it('active link has aria-current="page"', () => {
    renderHeader('/about')
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    const aboutLink = Array.from(nav.querySelectorAll('a')).find(
      (a) => a.textContent === 'About Us'
    )
    expect(aboutLink.getAttribute('aria-current')).toBe('page')
  })

  it('inactive links do NOT have aria-current', () => {
    renderHeader('/about')
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    const inactiveLinks = Array.from(nav.querySelectorAll('a')).filter(
      (a) => a.textContent !== 'About Us' && a.getAttribute('style') // only nav links, not button
    )
    inactiveLinks.forEach((link) => {
      expect(link.getAttribute('aria-current')).toBeNull()
    })
  })
})

describe('Header — mobile hamburger button', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null })
  })

  it('hamburger button is in the document', () => {
    renderHeader()
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('hamburger bars use bg-[#499D95] (teal, visible on white header)', () => {
    renderHeader()
    const btn = screen.getByRole('button', { name: /open menu/i })
    const bars = btn.querySelectorAll('span')
    expect(bars.length).toBe(3)
    bars.forEach((bar) => {
      expect(bar.className).toContain('bg-[#499D95]')
    })
  })

  it('hamburger bars do NOT use bg-white (would be invisible on white header)', () => {
    renderHeader()
    const btn = screen.getByRole('button', { name: /open menu/i })
    const bars = btn.querySelectorAll('span')
    bars.forEach((bar) => {
      expect(bar.className).not.toContain('bg-white')
    })
  })

  it('hamburger has aria-expanded="false" when closed', () => {
    renderHeader()
    const btn = screen.getByRole('button', { name: /open menu/i })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  it('aria-label becomes "Close menu" when open', () => {
    renderHeader()
    const btn = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
  })

  it('aria-expanded becomes "true" after opening', () => {
    renderHeader()
    const btn = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
  })
})

describe('Header — mobile dropdown visibility', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null })
  })

  it('mobile dropdown is hidden initially', () => {
    renderHeader()
    expect(
      screen.queryByRole('navigation', { name: 'Mobile navigation' })
    ).not.toBeInTheDocument()
  })

  it('mobile dropdown appears after hamburger click', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' })
    ).toBeInTheDocument()
  })

  it('mobile dropdown has white background class (bg-white)', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' })
    expect(mobileNav.className).toContain('bg-white')
  })

  it('mobile dropdown links use teal colour (#387A74 / rgb(56,122,116)), not white-on-white', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' })
    const links = mobileNav.querySelectorAll('a[style]')
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      const style = link.getAttribute('style') || ''
      const hasTeal =
        style.includes('387A74') ||
        style.includes('387a74') ||
        style.includes('rgb(56, 122, 116)') ||
        style.includes('rgb(56,122,116)')
      expect(hasTeal).toBe(true)
    })
  })

  it('mobile dropdown links do NOT use text-white (would be invisible on white bg)', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' })
    const links = mobileNav.querySelectorAll('a')
    links.forEach((link) => {
      expect(link.className).not.toContain('text-white')
    })
  })

  it('mobile dropdown closes when a link is clicked', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' })
    const firstLink = mobileNav.querySelector('a')
    fireEvent.click(firstLink)
    expect(
      screen.queryByRole('navigation', { name: 'Mobile navigation' })
    ).not.toBeInTheDocument()
  })

  it('mobile active link has aria-current="page"', () => {
    renderHeader('/services')
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' })
    const servicesLink = Array.from(mobileNav.querySelectorAll('a')).find(
      (a) => a.textContent === 'Services'
    )
    expect(servicesLink.getAttribute('aria-current')).toBe('page')
  })
})

describe('Header — all six nav routes present', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null })
  })

  const routes = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ]

  routes.forEach(({ label, href }) => {
    it(`desktop nav contains "${label}" link pointing to ${href}`, () => {
      renderHeader()
      const nav = screen.getByRole('navigation', { name: 'Main navigation' })
      const link = Array.from(nav.querySelectorAll('a')).find(
        (a) => a.textContent === label
      )
      expect(link).toBeDefined()
      expect(link.getAttribute('href')).toBe(href)
    })
  })
})
