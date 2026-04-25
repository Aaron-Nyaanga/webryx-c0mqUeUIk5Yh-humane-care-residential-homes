import React, { useState, useEffect } from 'react'
import { query, orderBy, onSnapshot, updateDoc } from 'firebase/firestore'
import { appColl, appDoc } from '../../firebase/config'

const TABS = ['All', 'New', 'Reviewed']

function StatusBadge({ status }) {
  if (status === 'new') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#499D95] text-white">
        New
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
      Reviewed
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  )
}

function formatDate(timestamp) {
  if (!timestamp) return '—'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    const q = query(appColl('contactSubmissions'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filtered = submissions.filter((s) => {
    if (activeTab === 'All') return true
    return s.status === activeTab.toLowerCase()
  })

  const newCount = submissions.filter(s => s.status === 'new').length

  const handleMarkReviewed = async (id) => {
    setUpdating(id)
    try {
      await updateDoc(appDoc('contactSubmissions', id), { status: 'reviewed' })
    } finally {
      setUpdating(null)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div>
      {/* Heading + summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contact Submissions</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? '...' : `${submissions.length} total`}
            {!loading && newCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#499D95] text-white">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeTab === tab
                ? 'bg-[#499D95] text-white border-[#499D95]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Email', 'Inquiry Type', 'Date', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">No contact submissions yet.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <React.Fragment key={s.id}>
                  <tr
                    onClick={() => toggleExpand(s.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name || '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      {s.email ? (
                        <a
                          href={`mailto:${s.email}`}
                          onClick={e => e.stopPropagation()}
                          className="text-[#499D95] hover:underline"
                        >
                          {s.email}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.inquiryType || s.subject || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status || 'new'} />
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      {(s.status || 'new') === 'new' && (
                        <button
                          disabled={updating === s.id}
                          onClick={() => handleMarkReviewed(s.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                          {updating === s.id ? 'Saving...' : 'Mark Reviewed'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === s.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Message</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.message || '—'}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-gray-400 py-12">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">No contact submissions yet.</span>
          </div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(s.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{s.name || '—'}</p>
                    {s.email && (
                      <a
                        href={`mailto:${s.email}`}
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-[#499D95] hover:underline"
                      >
                        {s.email}
                      </a>
                    )}
                  </div>
                  <StatusBadge status={s.status || 'new'} />
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{s.inquiryType || s.subject || '—'}</span>
                  <span>•</span>
                  <span>{formatDate(s.createdAt)}</span>
                </div>
              </div>

              {expandedId === s.id && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Message</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{s.message || '—'}</p>
                  {(s.status || 'new') === 'new' && (
                    <button
                      disabled={updating === s.id}
                      onClick={() => handleMarkReviewed(s.id)}
                      className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      {updating === s.id ? 'Saving...' : 'Mark Reviewed'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
