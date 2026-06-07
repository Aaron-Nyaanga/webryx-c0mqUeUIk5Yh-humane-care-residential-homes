import React, { useState, useEffect } from 'react'
import { query, orderBy, onSnapshot, updateDoc } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { appColl, appDoc } from '../../firebase/config'
import ApprovalModal from '../../components/admin/ApprovalModal'
import RejectionModal from '../../components/admin/RejectionModal'

const TABS = ['All', 'New', 'Reviewed', 'Approved', 'Rejected']

const STATUS_STYLES = {
  new: 'bg-[#499D95] text-white',
  reviewed: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.new
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${style}`}>
      {status || 'new'}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
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

function formatLockedDate(app) {
  const history = app.statusHistory
  const raw =
    history && history.length > 0
      ? history[history.length - 1].changedAt
      : app.updatedAt
  if (!raw) return '—'
  const date = raw.toDate ? raw.toDate() : new Date(raw)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function DetailPanel({ app, onStatusChange, updating, onApprove, onReject }) {
  return (
    <div className="bg-gray-50 border-t border-gray-100 px-6 py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Full Name</p>
          <p className="text-sm text-gray-800">{app.name || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Email</p>
          {app.email ? (
            <a href={`mailto:${app.email}`} className="text-sm text-[#499D95] hover:underline">{app.email}</a>
          ) : <p className="text-sm text-gray-800">—</p>}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Phone</p>
          <p className="text-sm text-gray-800">{app.phone || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Position</p>
          <p className="text-sm text-gray-800">{app.position || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Experience</p>
          <p className="text-sm text-gray-800">{app.experience || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Preferred Shift(s)</p>
          <p className="text-sm text-gray-800">
            {Array.isArray(app.preferredShifts) && app.preferredShifts.length > 0
              ? app.preferredShifts.join(', ')
              : (app.preferredShift || '—')}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Current Status</p>
          <StatusBadge status={app.status || 'new'} />
        </div>
      </div>

      {(app.coverLetter || app.message) && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Cover Letter / Message</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.coverLetter || app.message}</p>
        </div>
      )}

      {app.resumeUrl && (
        <div className="mb-4">
          <a
            href={app.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#499D95] hover:text-[#387A74] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Resume
          </a>
        </div>
      )}

      {/* Status action buttons / locked indicator */}
      <div className="pt-2 border-t border-gray-200">
        {(app.status === 'approved' || app.status === 'rejected') ? (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>
              Status locked —{' '}
              <span className="capitalize">{app.status}</span>
              {' '}on {formatLockedDate(app)}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(app.status || 'new') !== 'reviewed' && (
              <button
                disabled={!!updating}
                onClick={() => onStatusChange(app.id, 'reviewed', app)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {updating === 'reviewed' ? 'Saving...' : 'Mark Reviewed'}
              </button>
            )}
            <button
              disabled={!!updating}
              onClick={() => onApprove({ id: app.id, name: app.name, email: app.email, position: app.position })}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#499D95] text-white hover:bg-[#387A74] disabled:opacity-50 transition-colors"
            >
              Approve
            </button>
            <button
              disabled={!!updating}
              onClick={() => onReject({ id: app.id, name: app.name, email: app.email, position: app.position })}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CareerApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [updating, setUpdating] = useState(null) // { id, status }
  const [approvalModal, setApprovalModal] = useState(null)
  const [rejectionModal, setRejectionModal] = useState(null)

  useEffect(() => {
    if (!user) return
    const q = query(appColl('careerApplications'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const filtered = applications.filter((a) => {
    if (activeTab === 'All') return true
    return (a.status || 'new') === activeTab.toLowerCase()
  })

  const newCount = applications.filter(a => (a.status || 'new') === 'new').length

  const handleStatusChange = async (id, newStatus, app) => {
    setUpdating({ id, status: newStatus })
    try {
      await updateDoc(appDoc('careerApplications', id), {
        status: newStatus,
        statusHistory: [...(app.statusHistory || []), {
          status: newStatus,
          message: '',
          changedAt: new Date().toISOString(),
        }],
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleApprovalSent = async (sentMessage) => {
    try {
      await updateDoc(appDoc('careerApplications', approvalModal.id), {
        status: 'approved',
        statusHistory: [...(applications.find(a => a.id === approvalModal.id)?.statusHistory || []), {
          status: 'approved',
          message: sentMessage,
          changedAt: new Date().toISOString()
        }]
      })
    } catch (err) {
      console.error('Failed to update application status:', err)
    } finally {
      setApprovalModal(null)
    }
  }

  const handleRejectionSent = async (sentMessage) => {
    try {
      await updateDoc(appDoc('careerApplications', rejectionModal.id), {
        status: 'rejected',
        statusHistory: [...(applications.find(a => a.id === rejectionModal.id)?.statusHistory || []), {
          status: 'rejected',
          message: sentMessage,
          changedAt: new Date().toISOString()
        }]
      })
    } catch (err) {
      console.error('Failed to update application status:', err)
    } finally {
      setRejectionModal(null)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const isUpdating = (id, status) =>
    updating && updating.id === id ? updating.status : null

  return (
    <div>
      {/* Heading + summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Career Applications</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? '...' : `${applications.length} total`}
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
              {['Name', 'Position', 'Experience', 'Date', 'Status', 'Resume', 'Actions'].map((h) => (
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
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm">No applications yet.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <React.Fragment key={a.id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.position || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.experience || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status || 'new'} />
                    </td>
                    <td className="px-4 py-3">
                      {a.resumeUrl ? (
                        <a
                          href={a.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#499D95] hover:underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleExpand(a.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        {expandedId === a.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === a.id && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <DetailPanel
                          app={a}
                          onStatusChange={handleStatusChange}
                          updating={isUpdating(a.id)}
                          onApprove={setApprovalModal}
                          onReject={setRejectionModal}
                        />
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm">No applications yet.</span>
          </div>
        ) : (
          filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{a.name || '—'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.position || '—'}</p>
                  </div>
                  <StatusBadge status={a.status || 'new'} />
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{a.experience || '—'}</span>
                  <span>•</span>
                  <span>{formatDate(a.createdAt)}</span>
                </div>
                <button
                  onClick={() => toggleExpand(a.id)}
                  className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {expandedId === a.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
              {expandedId === a.id && (
                <DetailPanel
                  app={a}
                  onStatusChange={handleStatusChange}
                  updating={isUpdating(a.id)}
                  onApprove={setApprovalModal}
                  onReject={setRejectionModal}
                />
              )}
            </div>
          ))
        )}
      </div>

      {approvalModal && (
        <ApprovalModal
          isOpen={!!approvalModal}
          applicant={approvalModal}
          onClose={() => setApprovalModal(null)}
          onSent={handleApprovalSent}
        />
      )}
      {rejectionModal && (
        <RejectionModal
          isOpen={!!rejectionModal}
          applicant={rejectionModal}
          onClose={() => setRejectionModal(null)}
          onSent={handleRejectionSent}
        />
      )}
    </div>
  )
}
