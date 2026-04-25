import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Careers', to: '/careers' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a3320' }} className="text-white" role="contentinfo" aria-label="footer">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold mb-3 leading-snug">
              Humane Care Residential Homes, LLC
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Providing compassionate, personalized residential care for adults with
              disabilities in a safe, home-like environment in Chesterfield, Virginia.
            </p>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'rgba(78,140,82,0.25)', color: '#a7d9ab' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Licensed &amp; Certified in Virginia
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all" style={{ backgroundColor: '#4E8C52' }} />
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: '#4E8C52' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/60 text-sm leading-relaxed">
                  9006 Celestial Lane<br />Chesterfield, VA 23832
                </span>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: '#4E8C52' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+18049244211"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  +1 (804) 924-4211
                </a>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: '#4E8C52' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/60 text-sm">Mon–Fri, 9:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderColor: 'rgba(255,255,255,0.08)' }} className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/35 text-xs">
            &copy; {new Date().getFullYear()} Humane Care Residential Homes, LLC. All rights reserved.
          </p>
          <p className="text-white/35 text-xs">Chesterfield, Virginia</p>
        </div>
      </div>
    </footer>
  )
}
