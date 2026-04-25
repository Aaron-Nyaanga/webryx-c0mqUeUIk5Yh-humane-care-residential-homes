import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import usePageTitle from '../hooks/usePageTitle'
import { fadeUp, fadeLeft, fadeRight, stagger, cardItem, vp } from '../utils/motionVariants'

const facilityPhotos = [
  { src: '/images/elderlyPhoto.jpg', caption: 'Compassionate Care' },
  { src: '/images/balcony.jpg', caption: 'Outdoor Space' },
  { src: '/images/backyard.jpg', caption: 'Backyard & Garden' },
]

const values = [
  {
    title: 'Compassion',
    text: 'Treating every resident with kindness, empathy, and genuine care.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  },
  {
    title: 'Dignity',
    text: 'Respecting the individuality and autonomy of every person in our care.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    title: 'Excellence',
    text: 'Maintaining the highest standards of residential care, every single day.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  },
]

export default function About() {
  usePageTitle('About Us')

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="relative py-36 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/frontHouseClose.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-black/50" aria-hidden="true" />
        <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65 mb-4">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold mb-4">
            About Humane Care
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            className="text-lg text-white/80">
            A place where compassion meets commitment
          </motion.p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Purpose & Direction</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Mission & Vision</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl p-10 flex flex-col gap-4 text-white"
              style={{ background: 'linear-gradient(135deg, #4E8C52 0%, #316B36 100%)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="leading-relaxed text-white/85">
                To provide a comfortable and secure environment that enables individuals to enjoy life while supporting independence.
              </p>
            </motion.div>

            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(78,140,82,0.12)' }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl p-10 flex flex-col gap-4 bg-white"
              style={{ border: '2px solid #e8f4e9' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style={{ backgroundColor: '#f0f9f0', color: '#4E8C52' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
              <p className="leading-relaxed text-gray-600">
                To maximize the quality of life for adults with disabilities by providing personalized, high-quality care from the heart in a home-like environment that promotes health and safety.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#fdf8f0' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: '#4E8C52' }}>Our Story</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">Who We Are</h2>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-8 md:p-12"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderLeft: '4px solid #4E8C52' }}
          >
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Humane Care Residential Homes, LLC is a licensed group home provider dedicated to supporting adults with disabilities in Chesterfield, Virginia. We believe every individual deserves to live in a safe, comfortable, and nurturing environment — one that feels like home.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our team of experienced caregivers and nursing staff work tirelessly to deliver personalized care that respects each resident's dignity, independence, and unique needs. Our facility is fully wheelchair accessible, featuring private bedrooms, accessible bathrooms, a welcoming common area, and a backup generator to ensure uninterrupted care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Facility Highlights ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Our Space</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Facility</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {facilityPhotos.map((photo) => (
              <motion.div
                key={photo.src}
                variants={cardItem}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.22 }}
                className="group relative rounded-2xl overflow-hidden shadow-md aspect-[4/3]"
              >
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-0 right-0 text-white text-sm font-semibold text-center px-3">{photo.caption}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#fdf8f0' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Core Values</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-7"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={cardItem}
                whileHover={{ y: -5, boxShadow: '0 14px 30px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-2xl p-8 flex flex-col gap-4"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderTop: '3px solid #4E8C52' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#f0f9f0', color: '#4E8C52' }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{value.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 px-6 text-white text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4E8C52 0%, #316B36 60%, #1a3320 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: '#a7d9ab' }} aria-hidden="true" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interested in Our Care?</h2>
          <p className="text-white/85 text-lg mb-9">Contact us today to schedule a tour or ask about availability.</p>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to="/contact" className="inline-block px-10 py-3.5 rounded-lg font-semibold bg-white text-gray-800 hover:bg-gray-50">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
