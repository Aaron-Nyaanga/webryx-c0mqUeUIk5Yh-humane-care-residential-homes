import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

const services = [
  {
    title: 'Personal Care',
    description:
      'Compassionate assistance with daily living activities including bathing, dressing, grooming, and hygiene to help residents look and feel their best.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Medication Management',
    description:
      'Careful, supervised administration of medications by our experienced nursing staff to ensure safety and consistency.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Nutritious Meals',
    description:
      'Chef-prepared, well-balanced meals and snacks tailored to each resident\'s dietary needs and preferences — served in our welcoming dining room.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: '24/7 Supervision',
    description:
      'Round-the-clock staffing ensures residents always have access to support, assistance, and emergency response at any hour.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Transportation',
    description:
      'Scheduled transportation for medical appointments, community outings, and recreational activities to keep residents connected.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'Community Integration',
    description:
      'Structured activities, social events, and community outings to promote meaningful engagement and a sense of belonging.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Housekeeping & Laundry',
    description:
      'Regular cleaning, laundry, and maintenance services so residents can enjoy a clean, comfortable living environment.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: 'Respite Care',
    description:
      'Short-term care services providing temporary relief for primary caregivers while ensuring continuity of quality support for residents.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

const facilityFeatures = [
  'Fully wheelchair accessible',
  'Private bedrooms for each resident',
  'Accessible bathrooms',
  'Comfortable common living areas',
  'Fully equipped kitchen and dining room',
  'Outdoor balcony and backyard space',
  'Backup generator for uninterrupted care',
  'Secure, monitored environment',
]

const admissionSteps = [
  {
    number: 1,
    title: 'Reach Out',
    description:
      'Contact us by phone or through our online form to express interest and ask any questions.',
  },
  {
    number: 2,
    title: 'Schedule a Tour',
    description:
      'Visit our facility to see the home, meet our staff, and get a feel for the environment.',
  },
  {
    number: 3,
    title: 'Begin Care',
    description:
      'Complete the intake process and welcome your loved one to their new home.',
  },
]

export default function Services() {
  usePageTitle('Our Services')
  return (
    <div>
      {/* Section 1 — Page Hero */}
      <section
        className="relative py-32 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/elderlyPhoto.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-white/85">
            Comprehensive, personalized care designed to support independence and quality of life.
          </p>
        </div>
      </section>

      {/* Section 2 — Services Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
            What We Provide
          </h2>
          <p className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-12">
            Every service is delivered with compassion, expertise, and a commitment to each resident's well-being.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-xl shadow-sm border border-gray-100 border-t-4 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
                style={{ borderTopColor: '#2D6A2F' }}
              >
                <div style={{ color: '#2D6A2F' }}>{service.icon}</div>
                <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Facility Features */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f0f7f0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            Our Facility
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Left — Feature list */}
            <ul className="flex flex-col gap-4">
              {facilityFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      style={{ color: '#2D6A2F' }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Right — Photo collage */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
                <img
                  src="/images/bathroom.jpg"
                  alt="Accessible Bathroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
                <img
                  src="/images/balcony.jpg"
                  alt="Balcony"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Admission Process */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            How to Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {admissionSteps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: '#2D6A2F' }}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-block px-10 py-3 rounded-md font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#2D6A2F' }}
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5 — CTA Banner */}
      <section className="py-20 px-6 text-white text-center" style={{ backgroundColor: '#2D6A2F' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have Questions About Our Services?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Our team is here to help. Reach out to discuss your loved one's needs.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-3 rounded-md font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1B5218' }}
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  )
}
