import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { query, onSnapshot } from 'firebase/firestore'
import { appColl } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import ContactSubmissions from './ContactSubmissions'
import CareerApplications from './CareerApplications'
import ManagePositions from './ManagePositions'

const NAV_ITEMS = [
  {
    id: 'Overview',
    label: 'Overview',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'Contact Submissions',
    label: 'Contact Submissions',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'Career Applications',
    label: 'Career Applications',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'Manage Positions',
    label: 'Manage Positions',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

function SummaryCard({ label, value, badge }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
      <span className="text-3xl font-bold text-[#499D95]">
        {value === null ? (
          <span className="text-gray-300 animate-pulse">—</span>
        ) : value}
      </span>
      <span className="mt-2 text-sm font-medium text-gray-500 text-center">{label}</span>
      {badge != null && badge > 0 && (
        <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#499D95] text-white">
          {badge} new
        </span>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Counts from Firestore
  const [contactTotal, setContactTotal] = useState(null)
  const [contactNew, setContactNew] = useState(null)
  const [careerTotal, setCareerTotal] = useState(null)
  const [careerNew, setCareerNew] = useState(null)

  useEffect(() => {
    const qContact = query(appColl('contactSubmissions'))
    const unsubContact = onSnapshot(qContact, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data())
      setContactTotal(docs.length)
      setContactNew(docs.filter(d => (d.status || 'new') === 'new').length)
    })

    const qCareer = query(appColl('careerApplications'))
    const unsubCareer = onSnapshot(qCareer, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data())
      setCareerTotal(docs.length)
      setCareerNew(docs.filter(d => (d.status || 'new') === 'new').length)
    })

    return () => {
      unsubContact()
      unsubCareer()
    }
  }, [])

  const combinedNew =
    contactNew !== null && careerNew !== null ? contactNew + careerNew : null

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const handleNav = (id) => {
    setActiveTab(id)
    setSidebarOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="bg-[#387A74] text-white flex items-center justify-between px-4 md:px-6 py-3 shadow-md z-20 relative">
        <div className="flex items-center gap-3">
          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-1 rounded hover:bg-[#499D95] transition-colors"
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img
            src="https://img1.wsimg.com/isteam/ip/c4b9dfa8-0b20-4cbe-9ee1-c309928d05ca/humane-care-logo-eda3f87.png"
            alt="Humane Care"
            className="h-9"
          />
        </div>

        <span className="font-semibold text-base tracking-wide hidden sm:block">
          {activeTab === 'Overview' ? 'Admin Dashboard' : activeTab}
        </span>

        <button
          onClick={handleLogout}
          className="bg-white text-[#387A74] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static top-0 left-0 h-full md:h-auto z-20 md:z-auto
            flex flex-col w-60 bg-white border-r border-gray-200 pt-16 md:pt-6
            shadow-lg md:shadow-none
            transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-3 text-left px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#499D95] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-5 md:p-8 overflow-auto">
          {activeTab === 'Overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
              <p className="text-sm text-gray-500 mb-6">Here is a summary of your latest activity.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <SummaryCard
                  label="Contact Submissions"
                  value={contactTotal}
                  badge={contactNew}
                />
                <SummaryCard
                  label="Career Applications"
                  value={careerTotal}
                  badge={careerNew}
                />
                <SummaryCard
                  label="Awaiting Review"
                  value={combinedNew}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('Contact Submissions')}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-left hover:border-[#499D95] transition-colors group"
                >
                  <p className="font-semibold text-gray-800 group-hover:text-[#499D95] transition-colors">
                    View Contact Submissions
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Review and respond to inquiries</p>
                </button>
                <button
                  onClick={() => setActiveTab('Career Applications')}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-left hover:border-[#499D95] transition-colors group"
                >
                  <p className="font-semibold text-gray-800 group-hover:text-[#499D95] transition-colors">
                    View Career Applications
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Manage applicants and update statuses</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Contact Submissions' && <ContactSubmissions />}
          {activeTab === 'Career Applications' && <CareerApplications />}
          {activeTab === 'Manage Positions' && <ManagePositions />}
        </main>
      </div>
    </div>
  )
}
