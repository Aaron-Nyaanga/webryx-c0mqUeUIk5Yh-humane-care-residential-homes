import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

const services = [
  {
    title: 'Personal Care',
    description: 'Assistance with daily activities including bathing, dressing, and grooming.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Medication Management',
    description: 'Supervised medication administration by experienced nursing staff.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Nutritious Meals',
    description: 'Chef-prepared meals and snacks tailored to dietary needs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: '24/7 Support',
    description: 'Around-the-clock supervision and assistance for peace of mind.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Community Integration',
    description: 'Activities and outings to promote social engagement.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Safe Environment',
    description: 'Wheelchair-accessible facility with generator backup power.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

const whyUs = [
  {
    title: 'Heart-Centered Care',
    text: 'We treat every resident like family, with compassion and dignity at the core of everything we do.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Experienced Staff',
    text: 'Our caregivers and nursing staff bring years of expertise to ensure the highest quality of care.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Home-Like Environment',
    text: 'A comfortable, welcoming setting that feels like home — not a facility.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: 'Independence First',
    text: 'We encourage personal choice and autonomy, supporting residents in living life on their terms.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

const facilityPhotos = [
  { src: '/images/livingroom.jpg', caption: 'Living Room' },
  { src: '/images/diningroom.jpg', caption: 'Dining Room' },
  { src: '/images/kitchen.jpg', caption: 'Kitchen' },
  { src: '/images/bedroom1.jpg', caption: 'Private Bedroom' },
]

export default function Home() {
  usePageTitle(null)
  return (
    <div>
      {/* Section 1 — Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/widefronthouse.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Compassionate Care, Comfortable Living
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
            Providing personalized, heart-centered residential care for adults with disabilities in a safe, home-like environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 rounded-md font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#499D95' }}
            >
              Get In Touch
            </Link>
            <Link
              to="/services"
              className="px-8 py-3 rounded-md font-semibold text-white border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              View Our Facility
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — Services Overview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">What We Offer</h2>
            <p className="text-gray-500 text-lg">Comprehensive support tailored to each individual's needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col gap-4 border border-gray-100"
              >
                <div style={{ color: '#499D95' }}>{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Why Choose Us */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f0f9f8' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why Families Choose Humane Care
            </h2>
            <blockquote className="italic text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              "Home is not where you live but where they understand you"
              <footer className="mt-3 text-base not-italic text-gray-500">— Christian Morgenstern</footer>
            </blockquote>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-14">
            {whyUs.map((item) => (
              <div key={item.title} className="flex gap-5 items-start">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: '#499D95' }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Facility Photo Strip */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Our Home</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Section 5 — CTA Banner */}
      <section className="py-20 px-6 text-white text-center" style={{ backgroundColor: '#499D95' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Learn More?</h2>
          <p className="text-white/90 text-lg mb-8">
            Contact us today to schedule a tour or ask about availability.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-3 rounded-md font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#387A74' }}
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
