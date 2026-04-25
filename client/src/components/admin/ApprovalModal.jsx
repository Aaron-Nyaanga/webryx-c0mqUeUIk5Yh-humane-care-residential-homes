import { useState, useEffect } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions, fnName } from '../../firebase/config'

export default function ApprovalModal({ isOpen, onClose, applicant, onSent }) {
  const defaultSubject = `Your Application at Humane Care Residential Homes — ${applicant?.position || ''}`
  const defaultMessage = `Dear ${applicant?.name || ''},

We are pleased to inform you that your application for the ${applicant?.position || ''} position at Humane Care Residential Homes has been reviewed and we would like to move forward with your application.

Please reply to this email or contact us at +1 (804) 924-4211 to schedule your next steps.

We look forward to speaking with you!

Warm regards,
Humane Care Residential Homes Team
9006 Celestial Lane, Chesterfield, VA 23832`

  const [subject, setSubject] = useState(defaultSubject)
  const [message, setMessage] = useState(defaultMessage)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && applicant) {
      setSubject(`Your Application at Humane Care Residential Homes — ${applicant.position}`)
      setMessage(`Dear ${applicant.name},

We are pleased to inform you that your application for the ${applicant.position} position at Humane Care Residential Homes has been reviewed and we would like to move forward with your application.

Please reply to this email or contact us at +1 (804) 924-4211 to schedule your next steps.

We look forward to speaking with you!

Warm regards,
Humane Care Residential Homes Team
9006 Celestial Lane, Chesterfield, VA 23832`)
      setError('')
    }
  }, [isOpen, applicant])

  if (!isOpen || !applicant) return null

  const handleSend = async () => {
    setSending(true)
    setError('')
    try {
      const sendApprovalEmail = httpsCallable(functions, fnName('sendApprovalEmail'))
      await sendApprovalEmail({
        toEmail: applicant.email,
        toName: applicant.name,
        position: applicant.position,
        subject,
        message,
      })
      onSent(message)
    } catch (err) {
      setError('Failed to send email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-[#499D95] px-6 py-4 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white/80 hover:text-white text-2xl font-light leading-none"
            aria-label="Close"
          >
            &times;
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Approve Application</h3>
              <p className="text-white/80 text-sm">{applicant.name} — {applicant.position}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email to Applicant</label>
            <p className="text-xs text-gray-400 mb-3">Sending to: {applicant.email}</p>

            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#499D95] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message</label>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#499D95] focus:border-transparent resize-y"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{message.length} characters</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 text-sm font-semibold bg-[#499D95] text-white rounded-lg hover:bg-[#387A74] disabled:opacity-60 transition-colors"
          >
            {sending ? 'Sending...' : 'Send Approval Email'}
          </button>
        </div>
      </div>
    </div>
  )
}
