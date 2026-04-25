import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import usePageTitle from '../hooks/usePageTitle'
import { fadeUp, fadeLeft, fadeRight, stagger, staggerFast, cardItem, vp } from '../utils/motionVariants'

const services = [
  {
    title: 'Personal Care',
    description: 'Assistance with daily activities including bathing, dressing, and grooming.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Medication Management',
    description: 'Supervised medication administration by experienced nursing staff.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Nutritious Meals',
    description: 'Chef-prepared meals and snacks tailored to dietary needs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: '24/7 Support',
    description: 'Around-the-clock supervision and assistance for peace of mind.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Community Integration',
    description: 'Activities and outings to promote social engagement.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Safe Environment',
    description: 'Wheelchair-accessible facility with generator backup power.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

const trustPillars = [
  { label: 'Licensed & Certified', sub: 'in Virginia', icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { label: '24/7 Support', sub: 'always available', icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Private Bedrooms', sub: 'for every resident', icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: 'Fully Accessible', sub: 'wheelchair ready', icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
]

const whyUs = [
  { title: 'Heart-Centered Care', text: 'We treat every resident like family, with compassion and dignity at the core of everything we do.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { title: 'Experienced Staff', text: 'Our caregivers and nursing staff bring years of expertise to ensure the highest quality of care.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { title: 'Home-Like Environment', text: 'A comfortable, welcoming setting that feels like home — not a facility.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { title: 'Independence First', text: 'We encourage personal choice and autonomy, supporting residents in living life on their terms.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
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
      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/widefronthouse.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/60" aria-hidden="true" />
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-4"
          >
            Chesterfield, Virginia
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            Compassionate Care,<br />Comfortable Living
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Providing personalized, heart-centered residential care for adults with
            disabilities in a safe, home-like environment.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="block px-8 py-3.5 rounded-lg font-semibold text-white shadow-lg"
                style={{ backgroundColor: '#4E8C52' }}
              >
                Get In Touch
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/services"
                className="block px-8 py-3.5 rounded-lg font-semibold text-white border-2 border-white/70 hover:bg-white hover:text-gray-900 transition-colors"
              >
                Our Services
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-white py-8 px-6 border-b border-gray-100">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {trustPillars.map((pillar) => (
            <motion.div
              key={pillar.label}
              variants={cardItem}
              className="flex flex-col items-center text-center gap-2.5"
            >
              <motion.div
                whileHover={{ scale: 1.12, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#f0f9f0', color: '#4E8C52' }}
              >
                {pillar.icon}
              </motion.div>
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{pillar.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{pillar.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Services Overview ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#4E8C52' }}>
              What We Offer
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Comprehensive Care Services
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Tailored support for each individual's unique needs and preferences.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={cardItem}
                whileHover={{ y: -6, boxShadow: '0 16px 36px rgba(0,0,0,0.11)' }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-4 cursor-default"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#f0f9f0', color: '#4E8C52' }}
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="text-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-white"
                style={{ backgroundColor: '#4E8C52' }}
              >
                View All Services
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#fdf8f0' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#4E8C52' }}>
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why Families Choose Humane Care
            </h2>
            <div className="relative inline-block">
              <span
                className="absolute -top-4 -left-6 text-7xl font-serif leading-none select-none"
                style={{ color: '#d1ead2', fontFamily: 'Georgia, serif' }}
                aria-hidden="true"
              >
                "
              </span>
              <blockquote className="relative italic text-xl md:text-2xl font-bold text-gray-700 max-w-2xl mx-auto leading-relaxed px-8">
                Home is not where you live but where they understand you
                <footer className="mt-3 text-base not-italic font-semibold text-gray-500">
                  — Christian Morgenstern
                </footer>
              </blockquote>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"
          >
            {whyUs.map((item) => (
              <motion.div
                key={item.title}
                variants={cardItem}
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-2xl p-7 flex gap-5 items-start"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: '#4E8C52' }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1.5">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Facility Photos ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#4E8C52' }}>
              Inside Our Home
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">A Glimpse of Our Home</h2>
          </motion.div>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {facilityPhotos.map((photo) => (
              <motion.div
                key={photo.src}
                variants={cardItem}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                />
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-3 left-0 right-0 text-white text-sm font-semibold text-center px-3"
                >
                  {photo.caption}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="text-center mt-10"
          >
            <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: '#4E8C52' }}
              >
                View Full Gallery
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-20 px-6 text-white text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4E8C52 0%, #316B36 60%, #1a3320 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: '#a7d9ab' }} aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 -translate-x-1/3 translate-y-1/3" style={{ backgroundColor: '#a7d9ab' }} aria-hidden="true" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="relative max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Learn More?</h2>
          <p className="text-white/85 text-lg mb-10">
            Contact us today to schedule a tour or ask about availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="block px-9 py-3.5 rounded-lg font-semibold text-white border-2 border-white/40"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                Contact Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/gallery"
                className="block px-9 py-3.5 rounded-lg font-semibold text-gray-800 bg-white hover:bg-gray-50"
              >
                View Gallery
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
