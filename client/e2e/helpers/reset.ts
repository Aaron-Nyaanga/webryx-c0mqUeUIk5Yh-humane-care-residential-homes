/**
 * Emulator reset helpers.
 *
 * Call resetEmulator() in beforeEach to wipe all data and re-seed
 * baseline state. Every test starts clean. Nothing persists.
 */

const PROJECT_ID = 'humane-care-residential-homes'
const FIRESTORE_BASE = `http://127.0.0.1:8080`
const AUTH_BASE = `http://127.0.0.1:9099`

// ─── Clear ────────────────────────────────────────────────────────────────────

async function clearFirestore() {
  const res = await fetch(
    `${FIRESTORE_BASE}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' }
  )
  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to clear Firestore emulator: ${res.status}`)
  }
}

async function clearAuth() {
  const res = await fetch(
    `${AUTH_BASE}/emulator/v1/projects/${PROJECT_ID}/accounts`,
    { method: 'DELETE' }
  )
  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to clear Auth emulator: ${res.status}`)
  }
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function firestoreSet(collection: string, docId: string, fields: Record<string, unknown>) {
  const url = `${FIRESTORE_BASE}/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?documentId=${docId}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to seed ${collection}/${docId}: ${res.status} — ${text}`)
  }
}

function strVal(v: string) { return { stringValue: v } }
function intVal(v: number) { return { integerValue: String(v) } }

async function seedJobPositions() {
  await firestoreSet('jobPositions', 'lpn', {
    slug: strVal('lpn'),
    title: strVal('Licensed Practical Nurse (LPN)'),
    openings: intVal(2),
  })
  await firestoreSet('jobPositions', 'dsp', {
    slug: strVal('dsp'),
    title: strVal('Direct Support Professional (DSP)'),
    openings: intVal(1),
  })
  await firestoreSet('jobPositions', 'cna', {
    slug: strVal('cna'),
    title: strVal('Certified Nursing Assistant (CNA)'),
    openings: intVal(0),
  })
  await firestoreSet('jobPositions', 'rn', {
    slug: strVal('rn'),
    title: strVal('Registered Nurse (RN)'),
    openings: intVal(0),
  })
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Wipes all emulator data then seeds baseline state.
 * Call this in test.beforeEach so every test starts from a known state.
 */
export { clearFirestore }

export async function resetEmulator() {
  await Promise.all([clearFirestore(), clearAuth()])
  await seedJobPositions()
}
