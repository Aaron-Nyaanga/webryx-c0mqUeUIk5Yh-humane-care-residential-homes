import { useState } from 'react'
import { motion } from 'motion/react'
import usePageTitle from '../hooks/usePageTitle'
import { fadeUp, fadeLeft, fadeRight, stagger, cardItem, vp } from '../utils/motionVariants'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { functions, appColl, fnName } from '../firebase/config'
import MapEmbed from '../components/ui/MapEmbed'

const initialForm = { name: '', email: '', phone: '', inquiryType: '', message: '' }

function validateForm({ name, email, inquiryType, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Full name is required.'
  if (!email.trim()) { errors.email = 'Email address is required.' }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = 'Please enter a valid email address.' }
  if (!inquiryType) errors.inquiryType = 'Please select an inquiry type.'
  if (!message.trim()) { errors.message = 'Message is required.' }
  else if (message.trim().length < 10) { errors.message = 'Message must be at least 10 characters.' }
  return errors
}

const contactItems = [
  {
    label: 'Phone',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    content: <a href="tel:+18049244211" className="font-medium transition-colors" style={{ color: '#316B36' }}>+1 (804) 924-4211</a>,
  },
  {
    label: 'Address',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    content: <span className="text-gray-700">9006 Celestial Lane<br />Chesterfield, VA 23832</span>,
  },
  {
    label: 'Hours',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    content: <div><p className="text-gray-700">Monday – Friday: 9:00 AM – 5:00 PM</p><p className="text-gray-400 text-sm mt-1">For urgent matters outside business hours, please call our main line.</p></div>,
  },
]

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border text-gray-800 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
    hasError
      ? 'border-red-400 bg-red-50 focus:ring-red-300'
      : 'border-gray-200 bg-gray-50 focus:border-green-400 focus:ring-green-200 focus:bg-white'
  }`

export default function Contact() {
  usePageTitle('Contact Us')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBanner(null)
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setLoading(true)
    try {
      await addDoc(appColl('contactSubmissions'), {
        name: form.name, email: form.email, phone: form.phone,
        inquiryType: form.inquiryType, message: form.message,
        status: 'new', createdAt: serverTimestamp(),
      })
      try {
        const sendContactEmail = httpsCallable(functions, fnName('sendContactEmail'))
        await sendContactEmail({ name: form.name, email: form.email, phone: form.phone, inquiryType: form.inquiryType, message: form.message })
      } catch (emailErr) { console.warn('Email notification failed:', emailErr) }
      setBanner({ type: 'success', message: "Thank you! Your message has been sent. We'll be in touch soon." })
      setForm(initialForm)
      setErrors({})
    } catch (err) {
      console.error('Contact form submission failed:', err)
      setBanner({ type: 'error', message: 'Something went wrong. Please try again or call us directly.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="py-24 px-6 text-white text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4E8C52 0%, #316B36 60%, #1a3320 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: '#a7d9ab' }} aria-hidden="true" />
        <div className="relative">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65 mb-4">We'd Love to Hear From You</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="text-4xl md:text-5xl font-bold mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }} className="text-lg md:text-xl max-w-2xl mx-auto text-white/80">Reach out with any questions about our services or to schedule a visit.</motion.p>
        </div>
      </section>

      {/* ── Contact Info + Map ── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp}>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Reach Us</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Get In Touch</h2>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="space-y-6">
              {contactItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={cardItem}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="flex items-start gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#f0f9f0', color: '#4E8C52' }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{item.label}</p>
                    {item.content}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={vp}>
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <MapEmbed />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="pb-24 px-6 max-w-3xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Send a Message</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Send Us a Message</h2>
          <p className="text-gray-500 text-base">Fill out the form below and we'll get back to you as soon as possible.</p>
        </motion.div>

        {/* Banner */}
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 px-5 py-4 rounded-xl text-sm font-medium flex items-start gap-3 ${banner.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
            role="alert"
          >
            {banner.type === 'success'
              ? <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              : <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }
            {banner.message}
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', borderTop: '3px solid #4E8C52' }}
        >
          <form onSubmit={handleSubmit} noValidate className="p-8 md:p-10 space-y-6">

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass(!!errors.name)} />
              {errors.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.name}</motion.p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass(!!errors.email)} />
                {errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.email}</motion.p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (804) 000-0000" className={inputClass(false)} />
              </div>
            </div>

            <div>
              <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-700 mb-2">Inquiry Type <span className="text-red-500">*</span></label>
              <select id="inquiryType" name="inquiryType" value={form.inquiryType} onChange={handleChange} className={inputClass(!!errors.inquiryType)}>
                <option value="">Select an inquiry type</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Admission Interest">Admission Interest</option>
                <option value="Visiting Hours">Visiting Hours</option>
                <option value="Employment">Employment</option>
                <option value="Other">Other</option>
              </select>
              {errors.inquiryType && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.inquiryType}</motion.p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="How can we help you?" className={`${inputClass(!!errors.message)} resize-none`} />
              {errors.message && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.message}</motion.p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#4E8C52', '--tw-ring-color': '#4E8C52' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </motion.svg>
                  Sending...
                </span>
              ) : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}
