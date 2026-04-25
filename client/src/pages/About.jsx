import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

const facilityPhotos = [
  { src: '/images/elderlyPhoto.jpg', caption: 'Compassionate Care' },
  { src: '/images/balcony.jpg', caption: 'Outdoor Space' },
  { src: '/images/backyard.jpg', caption: 'Backyard & Garden' },
]

const values = [
  {
    title: 'Compassion',
    text: 'Treating every resident with kindness, empathy, and genuine care.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Dignity',
    text: 'Respecting the individuality and autonomy of every person in our care.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Excellence',
    text: 'Maintaining the highest standards of residential care, every single day.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
]

export default function About() {
  usePageTitle('About Us')
  return (
    <div>
      {/* Section 1 — Page Hero */}
      <section
        className="relative py-32 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/frontHouseClose.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Humane Care</h1>
          <p className="text-lg text-white/85">A place where compassion meets commitment</p>
        </div>
      </section>

      {/* Section 2 — Mission & Vision */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div
            className="rounded-xl p-10 flex flex-col gap-4 text-white"
            style={{ backgroundColor: '#2D6A2F' }}
          >
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="leading-relaxed text-white/90">
              To provide a comfortable and secure environment that enables individuals to enjoy life while supporting independence.
            </p>
          </div>
          {/* Vision */}
          <div
            className="rounded-xl p-10 flex flex-col gap-4 bg-white border-2"
            style={{ borderColor: '#2D6A2F' }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            <p className="leading-relaxed text-gray-600">
              To maximize the quality of life for adults with disabilities by providing personalized, high-quality care from the heart in a home-like environment that promotes health and safety.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — Who We Are */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f0f7f0' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            Humane Care Residential Homes, LLC is a licensed group home provider dedicated to supporting adults with disabilities in Chesterfield, Virginia. We believe every individual deserves to live in a safe, comfortable, and nurturing environment — one that feels like home. Our team of experienced caregivers and nursing staff work tirelessly to deliver personalized care that respects each resident's dignity, independence, and unique needs.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Our facility is fully wheelchair accessible, featuring private bedrooms, accessible bathrooms, a welcoming common area, and a backup generator to ensure uninterrupted care. We are committed to building a caring community where residents thrive.
          </p>
        </div>
      </section>

      {/* Section 4 — Facility Highlights */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Our Facility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {facilityPhotos.map((photo) => (
              <div key={photo.src} className="relative rounded-xl overflow-hidden shadow-md aspect-[4/3]">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm font-medium text-center py-2 px-3">
                  {photo.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Core Values */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f0f7f0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-4 border-t-4"
                style={{ borderColor: '#2D6A2F' }}
              >
                <div style={{ color: '#2D6A2F' }}>{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — CTA Banner */}
      <section className="py-20 px-6 text-white text-center" style={{ backgroundColor: '#2D6A2F' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interested in Our Care?</h2>
          <p className="text-white/90 text-lg mb-8">
            Contact us today to schedule a tour or ask about availability.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-3 rounded-md font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1B5218' }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
