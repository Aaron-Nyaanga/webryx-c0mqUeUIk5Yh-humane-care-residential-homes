import { useState, useEffect, useRef } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { httpsCallable } from 'firebase/functions'
import { storage, functions, appColl, fnName } from '../firebase/config'

const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx']
const MAX_FILE_BYTES = 5 * 1024 * 1024

const initialForm = {
  name: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  message: '',
}

function validateForm({ name, email, phone, position, experience }, file, positions) {
  const errors = {}
  if (!name.trim()) errors.name = 'Full name is required.'
  if (!email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!phone.trim()) errors.phone = 'Phone number is required.'
  if (!position) {
    errors.position = 'Please select a position.'
  } else {
    const selected = positions.find((p) => p.title === position)
    if (selected && selected.openings === 0) {
      errors.position = 'This position is no longer accepting applications.'
    }
  }
  if (!experience) errors.experience = 'Please select your experience level.'
  if (!file) {
    errors.resume = 'Resume is required.'
  } else {
    const ext = file.name.split('.').pop().toLowerCase()
    const validType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(`.${ext}`)
    if (!validType) errors.resume = 'Please upload a PDF, DOC, or DOCX file.'
    else if (file.size > MAX_FILE_BYTES) errors.resume = 'File size must be under 5MB.'
  }
  return errors
}

const benefits = [
  {
    title: 'Meaningful Work',
    description: 'Make a real difference in residents\u2019 lives every single day.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Supportive Team',
    description: 'Join a close-knit team that values collaboration, growth, and well-being.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Flexible Schedules',
    description: 'Part-time and full-time positions available to fit your lifestyle.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

// Static position definitions. The `slug` field must match the `slug` field
// on the corresponding doc in the `jobPositions` Firestore collection.
const POSITION_DEFS = [
  {
    slug: 'lpn',
    title: 'Licensed Practical Nurse (LPN)',
    type: 'Part-time or Full-time',
    description:
      'Provide skilled nursing care including medication administration, wound care, and health monitoring for our residents under the direction of the RN.',
    requirements: [
      'Valid LPN license in Virginia',
      'Compassionate and patient-centered approach',
      'Experience in residential or long-term care preferred',
    ],
  },
  {
    slug: 'dsp',
    title: 'Direct Support Professional (DSP)',
    type: 'Part-time or Full-time',
    description:
      'Assist residents with daily living activities, community integration, and personal care while fostering independence and dignity.',
    requirements: [
      'High school diploma or equivalent',
      'Valid driver\u2019s license preferred',
      'Prior caregiving experience a plus',
      'Genuine passion for helping others',
    ],
  },
  {
    slug: 'rn',
    title: 'Registered Nurse (RN)',
    type: null,
    description:
      'Oversee resident health care plans, supervise LPN/DSP staff, and ensure the highest standards of nursing care.',
    requirements: [
      'Valid RN license in Virginia',
      'Supervisory experience preferred',
    ],
  },
]

function scrollToForm() {
  const el = document.getElementById('application-form')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Careers() {
  usePageTitle('Careers')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState(null)
  const [submitState, setSubmitState] = useState('idle') // 'idle' | 'uploading' | 'submitting'
  const [banner, setBanner] = useState(null) // { type: 'success' | 'error', message: string }
  const fileInputRef = useRef(null)

  // Live openings data from Firestore
  // firestorePositions: { [slug]: number }
  const [firestorePositions, setFirestorePositions] = useState(null) // null = loading

  useEffect(() => {
    const unsubscribe = onSnapshot(appColl('jobPositions'), (snapshot) => {
      const map = {}
      snapshot.docs.forEach((d) => {
        const data = d.data()
        if (data.slug) {
          map[data.slug] = typeof data.openings === 'number' ? data.openings : 0
        }
      })
      setFirestorePositions(map)
    })
    return unsubscribe
  }, [])

  // Merge static defs with live openings. Falls back to 0 if slug not found in Firestore.
  const positions = POSITION_DEFS.map((def) => {
    const openings = firestorePositions !== null
      ? (firestorePositions[def.slug] ?? 0)
      : null // null while loading
    return { ...def, openings }
  })

  // Positions available for the dropdown (openings > 0, or still loading)
  const openPositions = positions.filter((p) => p.openings === null || p.openings > 0)

  // True when every position has 0 openings (and we're not loading)
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setSubmitState('uploading')
      const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const resumeUrl = await getDownloadURL(storageRef)

      setSubmitState('submitting')
      await addDoc(appColl('careerApplications'), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        experience: form.experience,
        message: form.message,
        resumeUrl,
        status: 'new',
        statusHistory: [],
        createdAt: serverTimestamp(),
      })

      const sendCareerEmail = httpsCallable(functions, fnName('sendCareerEmail'))
      await sendCareerEmail({
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        experience: form.experience,
        message: form.message,
        resumeUrl,
      })

      setBanner({
        type: 'success',
        message: "Application submitted! We'll review your application and be in touch soon.",
      })
      setForm(initialForm)
      setFile(null)
      setErrors({})
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setBanner({
        type: 'error',
        message: 'Something went wrong. Please try again or email us directly.',
      })
    } finally {
      setSubmitState('idle')
    }
  }

  const isLoading = submitState !== 'idle'
  const buttonLabel =
    submitState === 'uploading'
      ? 'Uploading...'
      : submitState === 'submitting'
      ? 'Submitting...'
      : 'Submit Application'

  return (
    <div className="min-h-screen bg-white">

      {/* Section 1 — Hero */}
      <section
        className="relative py-28 px-6 flex items-center justify-center text-white text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/widefronthouse.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Join Our Team
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Build a meaningful career supporting adults with disabilities in a compassionate,
            team-focused environment.
          </p>
        </div>
      </section>

      {/* Section 2 — Why Work With Us */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f0f7f0' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="font-playfair text-3xl md:text-4xl font-bold"
              style={{ color: '#1B5218' }}
            >
              Why Work at Humane Care?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center gap-4"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e8f5e9', color: '#2D6A2F' }}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{benefit.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Open Positions */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="font-playfair text-3xl md:text-4xl font-bold"
              style={{ color: '#1B5218' }}
            >
              Current Openings
            </h2>
          </div>
          {/* Loading skeleton for position cards */}
          {firestorePositions === null ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse bg-white shadow-md rounded-xl overflow-hidden"
                  style={{ borderLeft: '4px solid #d1d5db' }}
                >
                  <div className="p-8 space-y-4">
                    <div className="flex gap-3">
                      <div className="h-5 bg-gray-200 rounded w-56" />
                      <div className="h-5 bg-gray-200 rounded w-20" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-32" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-4/5" />
                    </div>
                    <div className="h-9 bg-gray-200 rounded w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {positions.map((pos) => {
                const hasOpenings = pos.openings > 0
                // Badge styles: green when open, gray when closed
                const badgeStyle = hasOpenings
                  ? { backgroundColor: '#d1fae5', color: '#065f46' }
                  : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                const badgeText = hasOpenings
                  ? `${pos.openings} Opening${pos.openings !== 1 ? 's' : ''}`
                  : '0 Openings'

                return (
                  <div
                    key={pos.slug}
                    className="bg-white shadow-md rounded-xl overflow-hidden"
                    style={{ borderLeft: '4px solid #2D6A2F' }}
                  >
                    <div className="p-8">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">{pos.title}</h3>
                        <span
                          className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                          style={badgeStyle}
                        >
                          {badgeText}
                        </span>
                      </div>

                      {pos.type && hasOpenings && (
                        <p className="text-sm font-medium mb-4" style={{ color: '#2D6A2F' }}>
                          {pos.type}
                        </p>
                      )}

                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{pos.description}</p>

                      <ul className="space-y-1 mb-6">
                        {pos.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-sm text-gray-500">
                            <svg
                              className="w-4 h-4 mt-0.5 flex-shrink-0"
                              style={{ color: '#2D6A2F' }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>

                      <div>
                        {hasOpenings ? (
                          <button
                            type="button"
                            onClick={scrollToForm}
                            className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
                            style={{ backgroundColor: '#2D6A2F' }}
                          >
                            Apply Now
                          </button>
                        ) : (
                          <div>
                            <button
                              type="button"
                              disabled
                              className="px-6 py-2.5 rounded-lg text-sm font-semibold border-2 opacity-50 cursor-not-allowed"
                              style={{ borderColor: '#9ca3af', color: '#9ca3af' }}
                            >
                              No Openings
                            </button>
                            <p className="mt-2 text-xs text-gray-400 italic">
                              No current openings — check back later.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Section 4 — Application Form */}
      <section id="application-form" className="py-20 px-6" style={{ backgroundColor: '#f0f7f0' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="font-playfair text-3xl md:text-4xl font-bold mb-3"
              style={{ color: '#1B5218' }}
            >
              Apply Now
            </h2>
            <p className="text-gray-600 text-base">
              Complete the form below and attach your resume. We'll be in touch soon.
            </p>
          </div>

          {/* Loading state — form skeleton while Firestore data is in flight */}
          {firestorePositions === null ? (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8 space-y-5" style={{ borderTop: '4px solid #2D6A2F' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="animate-pulse space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-32" />
                  <div className="h-10 bg-gray-100 rounded-lg w-full" />
                </div>
              ))}
              <div className="animate-pulse h-11 bg-gray-200 rounded-lg w-full" />
            </div>
          ) : /* No openings state — hide form entirely */
          allClosed ? (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-10 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-600 font-medium">
                There are currently no open positions. Please check back later.
              </p>
            </div>
          ) : (
          <>
          {/* Banner */}
          {banner && (
            <div
              className={`mb-6 px-5 py-4 rounded-lg text-sm font-medium ${
                banner.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
              role="alert"
            >
              {banner.message}
            </div>
          )}

          {/* Card */}
          <div
            className="bg-white shadow-lg rounded-xl overflow-hidden"
            style={{ borderTop: '4px solid #2D6A2F' }}
          >
            <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (804) 000-0000"
                  className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-1">
                  Position Applying For <span className="text-red-500">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white ${
                    errors.position ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a position</option>
                  {openPositions.map((pos) => (
                    <option key={pos.slug} value={pos.title}>
                      {pos.title}
                    </option>
                  ))}
                </select>
                {errors.position && <p className="mt-1 text-xs text-red-600">{errors.position}</p>}
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white ${
                    errors.experience ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select experience</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1–2 years">1&ndash;2 years</option>
                  <option value="3–5 years">3&ndash;5 years</option>
                  <option value="6–10 years">6&ndash;10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
                {errors.experience && <p className="mt-1 text-xs text-red-600">{errors.experience}</p>}
              </div>

              {/* Cover Letter */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                  Cover Letter / Additional Info{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself and why you'd like to join our team..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-1">
                  Resume (PDF, DOC, or DOCX &mdash; max 5MB){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="resume"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className={`w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer cursor-pointer border rounded-lg px-3 py-2 transition ${
                    errors.resume ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  style={
                    errors.resume
                      ? {}
                      : { '--file-bg': '#2D6A2F' }
                  }
                />
                <style>{`#resume::file-selector-button { background-color: #2D6A2F; } #resume::file-selector-button:hover { background-color: #1B5218; }`}</style>
                {file && !errors.resume && (
                  <p className="mt-1 text-xs text-gray-500">Selected: {file.name}</p>
                )}
                {errors.resume && <p className="mt-1 text-xs text-red-600">{errors.resume}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg text-white text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: isLoading ? '#1B5218' : '#2D6A2F' }}
              >
                {buttonLabel}
              </button>
            </form>
          </div>
          </>
          )}
        </div>
      </section>
    </div>
  )
}
