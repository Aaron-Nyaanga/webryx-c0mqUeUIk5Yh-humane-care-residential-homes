import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import usePageTitle from '../hooks/usePageTitle'
import { fadeUp, fadeLeft, fadeRight, stagger, cardItem, vp } from '../utils/motionVariants'

const services = [
  { title: 'Personal Care', description: 'Compassionate assistance with daily living activities including bathing, dressing, grooming, and hygiene to help residents look and feel their best.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { title: 'Medication Management', description: 'Careful, supervised administration of medications by our experienced nursing staff to ensure safety and consistency.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { title: 'Nutritious Meals', description: "Chef-prepared, well-balanced meals and snacks tailored to each resident's dietary needs and preferences — served in our welcoming dining room.", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  { title: '24/7 Supervision', description: 'Round-the-clock staffing ensures residents always have access to support, assistance, and emergency response at any hour.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { title: 'Transportation', description: 'Scheduled transportation for medical appointments, community outings, and recreational activities to keep residents connected.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
  { title: 'Community Integration', description: 'Structured activities, social events, and community outings to promote meaningful engagement and a sense of belonging.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { title: 'Housekeeping & Laundry', description: 'Regular cleaning, laundry, and maintenance services so residents can enjoy a clean, comfortable living environment.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { title: 'Respite Care', description: 'Short-term care services providing temporary relief for primary caregivers while ensuring continuity of quality support for residents.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
]

const facilityFeatures = [
  'Fully wheelchair accessible', 'Private bedrooms for each resident', 'Accessible bathrooms',
  'Comfortable common living areas', 'Fully equipped kitchen and dining room',
  'Outdoor balcony and backyard space', 'Backup generator for uninterrupted care',
  'Secure, monitored environment',
]

const admissionSteps = [
  { number: 1, title: 'Reach Out', description: 'Contact us by phone or through our online form to express interest and ask any questions.' },
  { number: 2, title: 'Schedule a Tour', description: 'Visit our facility to see the home, meet our staff, and get a feel for the environment.' },
  { number: 3, title: 'Begin Care', description: 'Complete the intake process and welcome your loved one to their new home.' },
]

export default function Services() {
  usePageTitle('Our Services')

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative py-36 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/elderlyPhoto.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-black/50" aria-hidden="true" />
        <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65 mb-4">What We Provide</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="text-4xl md:text-5xl font-bold mb-4">Our Services</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }} className="text-lg text-white/80">Comprehensive, personalized care designed to support independence and quality of life.</motion.p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Comprehensive Care</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">What We Provide</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Every service is delivered with compassion, expertise, and a commitment to each resident's well-being.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={cardItem}
                whileHover={{ y: -5, boxShadow: '0 14px 30px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 flex flex-col gap-3.5 cursor-default"
                style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', borderTop: '3px solid #4E8C52' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#f0f9f0', color: '#4E8C52' }}
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-base font-bold text-gray-800">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Facility Features ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#fdf8f0' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Our Space</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Facility</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.ul variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp} className="flex flex-col gap-3.5">
              {facilityFeatures.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={vp}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                  className="flex items-center gap-3.5"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0f9f0' }}>
                    <svg className="h-4 w-4" style={{ color: '#4E8C52' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={vp} className="flex flex-col gap-5">
              {[{ src: '/images/bathroom.jpg', alt: 'Accessible Bathroom' }, { src: '/images/balcony.jpg', alt: 'Balcony' }].map((img) => (
                <motion.div
                  key={img.src}
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl overflow-hidden shadow-md aspect-[4/3]"
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Admission Steps ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Getting Started</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">How to Get Started</h2>
          </motion.div>

          <div className="relative">
            <div className="hidden md:flex absolute top-7 left-0 right-0 items-center px-24 pointer-events-none" aria-hidden="true">
              <div className="step-connector" />
              <div className="w-5 h-5 flex-shrink-0 rounded-full" style={{ backgroundColor: '#4E8C52' }} />
              <div className="step-connector" />
            </div>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              {admissionSteps.map((step) => (
                <motion.div key={step.number} variants={cardItem} className="flex flex-col items-center text-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #4E8C52, #316B36)' }}
                  >
                    {step.number}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mt-14">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" className="inline-flex items-center gap-2 px-9 py-3.5 rounded-lg font-semibold text-white" style={{ backgroundColor: '#4E8C52' }}>
                Contact Us Today
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-white text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4E8C52 0%, #316B36 60%, #1a3320 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: '#a7d9ab' }} aria-hidden="true" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions About Our Services?</h2>
          <p className="text-white/85 text-lg mb-9">Our team is here to help. Reach out to discuss your loved one's needs.</p>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to="/contact" className="inline-block px-10 py-3.5 rounded-lg font-semibold bg-white text-gray-800 hover:bg-gray-50">Get In Touch</Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
