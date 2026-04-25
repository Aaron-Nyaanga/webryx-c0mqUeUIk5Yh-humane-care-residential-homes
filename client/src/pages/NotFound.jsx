import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page Not Found')

  return (
    <main role="main">
      <section
        className="py-20 px-6 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #499D95 0%, #387A74 100%)' }}
      >
        <p
          className="text-8xl md:text-9xl font-bold mb-4"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Page Not Found</h1>
        <p className="text-white/80 text-lg max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </section>

      <section className="py-16 px-6 flex flex-col items-center gap-4 bg-white">
        <Link
          to="/"
          className="px-8 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#499D95' }}
        >
          Go Home
        </Link>
        <Link
          to="/contact"
          className="px-8 py-3 rounded-lg font-semibold border-2 transition-colors hover:bg-teal-50"
          style={{ borderColor: '#499D95', color: '#499D95' }}
        >
          Contact Us
        </Link>
      </section>
    </main>
  )
}
