import { readFileSync, unlinkSync, existsSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PID_FILE = resolve(__dirname, '../.emulator.pid')

export default async function globalTeardown() {
  if (!existsSync(PID_FILE)) return

  const pid = parseInt(readFileSync(PID_FILE, 'utf-8').trim(), 10)

  try {
    process.kill(pid, 'SIGTERM')
    console.log(`\n✓ Firebase emulators stopped (PID ${pid})`)
  } catch {
    // Process may have already exited — not an error
  }

  unlinkSync(PID_FILE)
}
