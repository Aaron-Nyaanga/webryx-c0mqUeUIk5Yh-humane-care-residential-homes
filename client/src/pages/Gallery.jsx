import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

const photos = [
  { src: '/images/widefronthouse.jpg', caption: 'Our Home — Exterior View' },
  { src: '/images/frontHouseClose.jpg', caption: 'Front of the House' },
  { src: '/images/livingroom.jpg', caption: 'Living Room' },
  { src: '/images/diningroom.jpg', caption: 'Dining Room' },
  { src: '/images/diningroom2.jpg', caption: 'Dining Area' },
  { src: '/images/kitchen.jpg', caption: 'Kitchen' },
  { src: '/images/kitchen2.jpg', caption: 'Kitchen & Prep Area' },
  { src: '/images/bedroom1.jpg', caption: 'Private Bedroom' },
  { src: '/images/bathroom.jpg', caption: 'Accessible Bathroom' },
  { src: '/images/balcony.jpg', caption: 'Balcony' },
  { src: '/images/backyard.jpg', caption: 'Backyard' },
  { src: '/images/elderlyPhoto.jpg', caption: 'Caring Environment' },
]

export default function Gallery() {
  usePageTitle('Facility Gallery')
  return (
    <div>
      {/* Section 1 — Page Hero */}
      <section
        className="py-32 flex items-center justify-center text-white text-center px-6"
        style={{ background: 'linear-gradient(135deg, #499D95 0%, #387A74 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Facility</h1>
          <p className="text-lg text-white/85">
            Take a look inside Humane Care Residential Homes — a comfortable, welcoming place to call home.
          </p>
        </div>
      </section>

      {/* Section 2 — Photo Gallery Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            Inside Our Home
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.src}
                className="group relative rounded-lg overflow-hidden shadow-sm aspect-[4/3]"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Caption overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <span className="w-full text-white text-sm font-medium text-center py-2 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/50">
                    {photo.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — CTA Banner */}
      <section className="py-20 px-6 text-white text-center" style={{ backgroundColor: '#499D95' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to See It in Person?</h2>
          <p className="text-white/90 text-lg mb-8">
            Schedule a tour and meet our team.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-3 rounded-md font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#387A74' }}
          >
            Schedule a Tour
          </Link>
        </div>
      </section>
    </div>
  )
}
