import { spawn } from 'child_process'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '../')
const PID_FILE = resolve(__dirname, '../.emulator.pid')
const FIRESTORE_HEALTH = 'http://127.0.0.1:8080/emulator/v1/projects/humane-care-residential-homes/databases/(default)/documents'

export default async function globalSetup() {
  console.log('\n▶ Starting Firebase emulators...')

  const emulator = spawn(
    'firebase',
    ['emulators:start', '--only', 'auth,firestore,storage', '--project', 'humane-care-residential-homes'],
    {
      cwd: PROJECT_ROOT,
      stdio: 'pipe',
      shell: true,
    }
  )

  writeFileSync(PID_FILE, String(emulator.pid))

  // Always show emulator output so failures are visible
  emulator.stdout?.on('data', (d) => process.stdout.write(d))
  emulator.stderr?.on('data', (d) => process.stderr.write(d))

  // Detect if process exits before emulators are ready
  let exited = false
  let exitCode: number | null = null
  emulator.on('exit', (code) => {
    exited = true
    exitCode = code
  })

  // Wait up to 120 seconds — first run downloads JARs and can be slow
  await waitForEmulator(60, 2000, () => {
    if (exited) {
      throw new Error(
        `Firebase emulator process exited early (code ${exitCode}).\n` +
        `Check the output above for details.\n` +
        `Common causes:\n` +
        `  - Java not installed (required): https://adoptium.net\n` +
        `  - firebase CLI not installed: npm install -g firebase-tools\n` +
        `  - Wrong project ID — run: firebase use humane-care-residential-homes`
      )
    }
  })

  console.log('\n✓ Firebase emulators ready\n')
}

async function waitForEmulator(
  maxAttempts: number,
  intervalMs: number,
  onTick: () => void
) {
  for (let i = 0; i < maxAttempts; i++) {
    onTick()
    try {
      const res = await fetch(FIRESTORE_HEALTH)
      if (res.status === 200 || res.status === 404) return
    } catch {
      // Not ready yet — keep waiting
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  throw new Error(
    `Firebase emulators did not respond within ${(maxAttempts * intervalMs) / 1000}s.\n` +
    `Try running manually to debug: firebase emulators:start --only auth,firestore,storage`
  )
}
