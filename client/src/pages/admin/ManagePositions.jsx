import { useState, useEffect } from 'react'
import { onSnapshot, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { appColl, appDoc } from '../../firebase/config'

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
        <div className="h-6 w-10 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

export default function ManagePositions() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  // updatingId: string | null — tracks which doc is mid-update
  const [updatingId, setUpdatingId] = useState(null)
  // errors: { [docId]: string } — inline error per card
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const unsubscribe = onSnapshot(appColl('jobPositions'), (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      // Sort alphabetically by title for stable display order
      docs.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      setPositions(docs)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function handleAdjust(id, delta) {
    // Guard: never decrement below zero on the client side
    if (delta === -1) {
      const current = positions.find((p) => p.id === id)
      const currentOpenings = current ? (typeof current.openings === 'number' ? current.openings : 0) : 0
      if (currentOpenings <= 0) return
    }

    setUpdatingId(id)
    setErrors((prev) => ({ ...prev, [id]: undefined }))
    try {
      await updateDoc(appDoc('jobPositions', id), {
        openings: increment(delta),
        updatedAt: serverTimestamp(),
      })
    } catch (err) {
      console.error('Failed to update position:', err)
      setErrors((prev) => ({ ...prev, [id]: 'Update failed. Please try again.' }))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Positions</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? '...' : `${positions.length} position${positions.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : positions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-gray-400 py-16">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm">No positions found in Firestore.</span>
          </div>
        ) : (
          positions.map((pos) => {
            const openings = typeof pos.openings === 'number' ? pos.openings : 0
            const isUpdating = updatingId === pos.id
            const errorMsg = errors[pos.id]

            return (
              <div
                key={pos.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left: title + openings label */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-800 truncate">
                      {pos.title || pos.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {openings === 0 ? (
                        <span className="text-gray-400">No current openings</span>
                      ) : (
                        <span className="text-[#499D95] font-medium">
                          {openings} Opening{openings !== 1 ? 's' : ''}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Right: counter controls */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Minus button */}
                    <button
                      onClick={() => handleAdjust(pos.id, -1)}
                      disabled={isUpdating || openings === 0}
                      aria-label={`Decrease openings for ${pos.title}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-bold leading-none"
                    >
                      −
                    </button>

                    {/* Count display */}
                    <span
                      className={`min-w-[2.5rem] text-center text-xl font-bold tabular-nums ${
                        isUpdating ? 'text-gray-300 animate-pulse' : 'text-gray-800'
                      }`}
                    >
                      {openings}
                    </span>

                    {/* Plus button */}
                    <button
                      onClick={() => handleAdjust(pos.id, 1)}
                      disabled={isUpdating}
                      aria-label={`Increase openings for ${pos.title}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#499D95] text-white hover:bg-[#387A74] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-bold leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Inline error */}
                {errorMsg && (
                  <p className="mt-3 text-xs text-red-600 font-medium">{errorMsg}</p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
