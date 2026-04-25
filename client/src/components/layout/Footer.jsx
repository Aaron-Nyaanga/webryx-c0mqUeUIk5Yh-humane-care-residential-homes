export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#316B36' }} className="text-white" role="contentinfo" aria-label="footer">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Humane Care Residential Homes, LLC</h2>
          <p>9006 Celestial Lane</p>
          <p>Chesterfield, VA 23832</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p>
            <a href="tel:+18049244211" className="hover:underline">
              +1 (804) 924-4211
            </a>
          </p>
          <p className="mt-1">Mon–Fri, 9:00 AM – 5:00 PM</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#316B36' }} className="border-t border-white/20">
        <p className="text-center text-sm py-3 px-4">
          &copy; {new Date().getFullYear()} Humane Care Residential Homes, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
