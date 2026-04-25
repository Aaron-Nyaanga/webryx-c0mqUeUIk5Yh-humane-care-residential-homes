import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { functions, appColl, fnName } from '../firebase/config'
import MapEmbed from '../components/ui/MapEmbed'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  inquiryType: '',
  message: '',
}

function validateForm({ name, email, inquiryType, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Full name is required.'
  if (!email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!inquiryType) errors.inquiryType = 'Please select an inquiry type.'
  if (!message.trim()) {
    errors.message = 'Message is required.'
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  }
  return errors
}

export default function Contact() {
  usePageTitle('Contact Us')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState(null) // { type: 'success' | 'error', message: string }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBanner(null)

    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      await addDoc(appColl('contactSubmissions'), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        inquiryType: form.inquiryType,
        message: form.message,
        status: 'new',
        createdAt: serverTimestamp(),
      })

      try {
        const sendContactEmail = httpsCallable(functions, fnName('sendContactEmail'))
        await sendContactEmail({
          name: form.name,
          email: form.email,
          phone: form.phone,
          inquiryType: form.inquiryType,
          message: form.message,
        })
      } catch (emailErr) {
        console.warn('Email notification failed:', emailErr)
      }

      setBanner({
        type: 'success',
        message: "Thank you! Your message has been sent. We'll be in touch soon.",
      })
      setForm(initialForm)
      setErrors({})
    } catch {
      setBanner({
        type: 'error',
        message: 'Something went wrong. Please try again or call us directly.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="py-20 px-6 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #499D95 0%, #387A74 100%)' }}
      >
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          We'd love to hear from you. Reach out with any questions about our services or to schedule
          a visit.
        </p>
      </section>

      {/* Contact Info + Map */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — Contact Details */}
          <div>
            <h2
              className="font-playfair text-3xl font-bold mb-8"
              style={{ color: '#387A74' }}
            >
              Get In Touch
            </h2>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#EBF5F4' }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: '#499D95' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+18049244211"
                    className="text-gray-800 text-base hover:underline"
                    style={{ color: '#387A74' }}
                  >
                    +1 (804) 924-4211
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#EBF5F4' }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: '#499D95' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Address
                  </p>
                  <p className="text-gray-800 text-base">
                    9006 Celestial Lane
                    <br />
                    Chesterfield, VA 23832
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#EBF5F4' }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: '#499D95' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Hours
                  </p>
                  <p className="text-gray-800 text-base">Monday – Friday: 9:00 AM – 5:00 PM</p>
                  <p className="text-sm text-gray-500 mt-2">
                    For urgent matters outside business hours, please call our main line.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Map */}
          <div>
            <MapEmbed />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="font-playfair text-3xl font-bold mb-3"
            style={{ color: '#387A74' }}
          >
            Send Us a Message
          </h2>
          <p className="text-gray-600 text-base">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

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
          style={{ borderTop: '4px solid #499D95' }}
        >
          <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
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
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
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
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (804) 000-0000"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>

            {/* Inquiry Type */}
            <div>
              <label
                htmlFor="inquiryType"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Inquiry Type <span className="text-red-500">*</span>
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={form.inquiryType}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white ${
                  errors.inquiryType ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select an inquiry type</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Admission Interest">Admission Interest</option>
                <option value="Visiting Hours">Visiting Hours</option>
                <option value="Employment">Employment</option>
                <option value="Other">Other</option>
              </select>
              {errors.inquiryType && (
                <p className="mt-1 text-xs text-red-600">{errors.inquiryType}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none ${
                  errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: loading ? '#387A74' : '#499D95' }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
