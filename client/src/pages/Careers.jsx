import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import usePageTitle from '../hooks/usePageTitle'
import { fadeUp, fadeLeft, fadeRight, stagger, cardItem, vp } from '../utils/motionVariants'
import { addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { httpsCallable } from 'firebase/functions'
import { storage, functions, appColl, fnName } from '../firebase/config'

const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx']
const MAX_FILE_BYTES = 5 * 1024 * 1024

const initialForm = { name: '', email: '', phone: '', position: '', experience: '', preferredShift: '', message: '' }

function validateForm({ name, email, phone, position, experience }, file, positions) {
  const errors = {}
  if (!name.trim()) errors.name = 'Full name is required.'
  if (!email.trim()) { errors.email = 'Email address is required.' }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = 'Please enter a valid email address.' }
  if (!phone.trim()) errors.phone = 'Phone number is required.'
  if (!position) { errors.position = 'Please select a position.' }
  else { const sel = positions.find((p) => p.title === position); if (sel && sel.openings === 0) errors.position = 'This position is no longer accepting applications.' }
  if (!experience) errors.experience = 'Please select your experience level.'
  if (!file) { errors.resume = 'Resume is required.' }
  else {
    const ext = file.name.split('.').pop().toLowerCase()
    const validType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(`.${ext}`)
    if (!validType) errors.resume = 'Please upload a PDF, DOC, or DOCX file.'
    else if (file.size > MAX_FILE_BYTES) errors.resume = 'File size must be under 5MB.'
  }
  return errors
}

const benefits = [
  { title: 'Meaningful Work', description: "Make a real difference in residents' lives every single day.", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
  { title: 'Supportive Team', description: 'Join a close-knit team that values collaboration, growth, and well-being.', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { title: 'Flexible Schedules', description: 'Part-time and full-time positions available to fit your lifestyle.', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

const POSITION_DEFS = [
  { slug: 'lpn', title: 'Licensed Practical Nurse (LPN)', type: 'Part-time or Full-time', description: 'Provide skilled nursing care including medication administration, wound care, and health monitoring for our residents under the direction of the RN.', requirements: ['Valid LPN license in Virginia', 'Compassionate and patient-centered approach', 'Experience in residential or long-term care preferred'] },
  { slug: 'dsp', title: 'Direct Support Professional (DSP)', type: 'Part-time or Full-time', description: 'Assist residents with daily living activities, community integration, and personal care while fostering independence and dignity.', requirements: ['High school diploma or equivalent', "Valid driver's license preferred", 'Prior caregiving experience a plus', 'Genuine passion for helping others'] },
  { slug: 'rn', title: 'Registered Nurse (RN)', type: null, description: 'Oversee resident health care plans, supervise LPN/DSP staff, and ensure the highest standards of nursing care.', requirements: ['Valid RN license in Virginia', 'Supervisory experience preferred'] },
]

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border text-gray-800 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${hasError ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-gray-200 bg-gray-50 focus:border-green-400 focus:ring-green-200 focus:bg-white'}`

function scrollToForm() {
  document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Careers() {
  usePageTitle('Careers')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState(null)
  const [submitState, setSubmitState] = useState('idle')
  const [banner, setBanner] = useState(null)
  const fileInputRef = useRef(null)
  const [firestorePositions, setFirestorePositions] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(appColl('jobPositions'), (snapshot) => {
      const map = {}
      snapshot.docs.forEach((d) => { const data = d.data(); if (data.slug) map[data.slug] = typeof data.openings === 'number' ? data.openings : 0 })
      setFirestorePositions(map)
    })
    return unsubscribe
  }, [])

  const positions = POSITION_DEFS.map((def) => ({ ...def, openings: firestorePositions !== null ? (firestorePositions[def.slug] ?? 0) : null }))
  const openPositions = positions.filter((p) => p.openings === null || p.openings > 0)
  const allClosed = firestorePositions !== null && positions.every((p) => p.openings === 0)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function handleFileChange(e) {
    const selected = e.target.files[0] || null
    setFile(selected)
    if (selected && errors.resume) setErrors((prev) => ({ ...prev, resume: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBanner(null)
    const validationErrors = validateForm(form, file, positions)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    try {
      setSubmitState('uploading')
      const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const resumeUrl = await getDownloadURL(storageRef)
      setSubmitState('submitting')
      await addDoc(appColl('careerApplications'), { name: form.name, email: form.email, phone: form.phone, position: form.position, experience: form.experience, preferredShift: form.preferredShift, message: form.message, resumeUrl, status: 'new', statusHistory: [], createdAt: serverTimestamp() })
      const sendCareerEmail = httpsCallable(functions, fnName('sendCareerEmail'))
      await sendCareerEmail({ name: form.name, email: form.email, phone: form.phone, position: form.position, experience: form.experience, preferredShift: form.preferredShift, message: form.message, resumeUrl })
      setBanner({ type: 'success', message: "Application submitted! We'll review your application and be in touch soon." })
      setForm(initialForm)
      setFile(null)
      setErrors({})
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setBanner({ type: 'error', message: 'Something went wrong. Please try again or email us directly.' })
    } finally {
      setSubmitState('idle')
    }
  }

  const isLoading = submitState !== 'idle'
  const buttonLabel = submitState === 'uploading' ? 'Uploading Resume...' : submitState === 'submitting' ? 'Submitting...' : 'Submit Application'

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative py-32 px-6 flex items-center justify-center text-white text-center bg-cover bg-center" style={{ backgroundImage: "url('/images/widefronthouse.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-black/50" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65 mb-4">Join Our Team</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="text-4xl md:text-5xl font-bold mb-5 leading-tight">Build a Career That Matters</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }} className="text-lg md:text-xl text-white/82 leading-relaxed">Support adults with disabilities in a compassionate, team-focused environment where every day makes a difference.</motion.p>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#fdf8f0' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Why Work With Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Work at Humane Care?</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={cardItem}
                whileHover={{ y: -5, boxShadow: '0 14px 30px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-4"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#f0f9f0', color: '#4E8C52' }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-gray-800">{benefit.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Now Hiring</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Current Openings</h2>
          </motion.div>

          {firestorePositions === null ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse bg-white rounded-2xl p-8 space-y-4" style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.06)', borderLeft: '4px solid #e5e7eb' }}>
                  <div className="flex gap-3"><div className="h-5 bg-gray-100 rounded-lg w-56" /><div className="h-5 bg-gray-100 rounded-full w-20" /></div>
                  <div className="h-3 bg-gray-100 rounded w-32" />
                  <div className="space-y-2"><div className="h-3 bg-gray-100 rounded w-full" /><div className="h-3 bg-gray-100 rounded w-4/5" /></div>
                  <div className="h-9 bg-gray-100 rounded-lg w-28" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="space-y-6">
              {positions.map((pos) => {
                const hasOpenings = pos.openings > 0
                return (
                  <motion.div
                    key={pos.slug}
                    variants={cardItem}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.07)', borderLeft: `4px solid ${hasOpenings ? '#4E8C52' : '#d1d5db'}` }}
                  >
                    <div className="p-8">
                      <div className="flex flex-wrap items-start gap-3 mb-4">
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">{pos.title}</h3>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                          style={hasOpenings ? { backgroundColor: '#d1fae5', color: '#065f46' } : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}
                        >
                          {hasOpenings && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                          {hasOpenings ? `${pos.openings} Opening${pos.openings !== 1 ? 's' : ''}` : '0 Openings'}
                        </span>
                      </div>
                      {pos.type && hasOpenings && <p className="text-sm font-semibold mb-4" style={{ color: '#4E8C52' }}>{pos.type}</p>}
                      <p className="text-gray-600 text-sm leading-relaxed mb-5">{pos.description}</p>
                      <ul className="space-y-2 mb-7">
                        {pos.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2.5 text-sm text-gray-500">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: '#f0f9f0' }}>
                              <svg className="w-3 h-3" style={{ color: '#4E8C52' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            {req}
                          </li>
                        ))}
                      </ul>
                      {hasOpenings ? (
                        <motion.button
                          whileHover={{ scale: 1.04, y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={scrollToForm}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                          style={{ backgroundColor: '#4E8C52' }}
                        >
                          Apply Now
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </motion.button>
                      ) : (
                        <div>
                          <button type="button" disabled className="px-6 py-2.5 rounded-xl text-sm font-semibold border-2 opacity-40 cursor-not-allowed" style={{ borderColor: '#d1d5db', color: '#9ca3af' }}>No Openings</button>
                          <p className="mt-2 text-xs text-gray-400">No current openings — check back later.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="application-form" className="py-20 px-6" style={{ backgroundColor: '#fdf8f0' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#4E8C52' }}>Application</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Apply Now</h2>
            <p className="text-gray-500 text-base">Complete the form below and attach your resume. We'll be in touch soon.</p>
          </motion.div>

          {firestorePositions === null ? (
            <div className="bg-white rounded-2xl overflow-hidden p-8 space-y-5" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', borderTop: '3px solid #4E8C52' }}>
              {[1, 2, 3, 4, 5].map((n) => <div key={n} className="animate-pulse space-y-2"><div className="h-3 bg-gray-100 rounded w-32" /><div className="h-12 bg-gray-50 rounded-xl w-full" /></div>)}
              <div className="animate-pulse h-12 bg-gray-100 rounded-xl w-full" />
            </div>
          ) : allClosed ? (
            <div className="bg-white rounded-2xl overflow-hidden p-12 text-center" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#f3f4f6' }}>
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <p className="text-gray-600 font-medium">There are currently no open positions. Please check back later.</p>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {banner && (
                  <motion.div
                    key="banner"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
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
              </AnimatePresence>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={vp}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.08)', borderTop: '3px solid #4E8C52' }}
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
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (804) 000-0000" className={inputClass(!!errors.phone)} />
                      {errors.phone && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.phone}</motion.p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">Position <span className="text-red-500">*</span></label>
                      <select id="position" name="position" value={form.position} onChange={handleChange} className={inputClass(!!errors.position)}>
                        <option value="">Select a position</option>
                        {openPositions.map((pos) => <option key={pos.slug} value={pos.title}>{pos.title}</option>)}
                      </select>
                      {errors.position && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.position}</motion.p>}
                    </div>
                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">Experience <span className="text-red-500">*</span></label>
                      <select id="experience" name="experience" value={form.experience} onChange={handleChange} className={inputClass(!!errors.experience)}>
                        <option value="">Select experience</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1–2 years">1–2 years</option>
                        <option value="3–5 years">3–5 years</option>
                        <option value="6–10 years">6–10 years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                      {errors.experience && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.experience}</motion.p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="preferredShift" className="block text-sm font-semibold text-gray-700 mb-2">Preferred Shift <span className="text-gray-400 font-normal">(optional)</span></label>
                    <select id="preferredShift" name="preferredShift" value={form.preferredShift} onChange={handleChange} className={inputClass(false)}>
                      <option value="">No preference</option>
                      <option value="Morning (7am–3pm)">Morning (7am–3pm)</option>
                      <option value="Afternoon (3pm–11pm)">Afternoon (3pm–11pm)</option>
                      <option value="Night (11pm–7am)">Night (11pm–7am)</option>
                      <option value="Flexible / Any">Flexible / Any</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Cover Letter / Additional Info <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Tell us a bit about yourself and why you'd like to join our team..." className={`${inputClass(false)} resize-none`} />
                  </div>

                  {/* Drag-look file upload zone */}
                  <div>
                    <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-2">Resume (PDF, DOC, DOCX — max 5 MB) <span className="text-red-500">*</span></label>
                    <motion.div
                      whileHover={{ borderColor: '#4E8C52', backgroundColor: '#f0f9f0' }}
                      transition={{ duration: 0.2 }}
                      className={`relative rounded-xl border-2 border-dashed transition-colors ${errors.resume ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <input id="resume" ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center justify-center py-6 gap-2 pointer-events-none">
                        <motion.svg
                          animate={file ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className="w-8 h-8"
                          style={{ color: file ? '#4E8C52' : '#9ca3af' }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </motion.svg>
                        {file ? (
                          <p className="text-sm font-medium" style={{ color: '#316B36' }}>{file.name}</p>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-gray-600">Click to upload your resume</p>
                            <p className="text-xs text-gray-400">PDF, DOC, or DOCX up to 5 MB</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                    {errors.resume && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600">⚠ {errors.resume}</motion.p>}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    className="w-full py-3.5 rounded-xl text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#4E8C52' }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </motion.svg>
                        {buttonLabel}
                      </span>
                    ) : buttonLabel}
                  </motion.button>
                </form>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
