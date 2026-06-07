import { test, expect } from '@playwright/test'
import { clearFirestore } from './helpers/reset'

const PROJECT_ID = 'webmint-83535'
const FIRESTORE_BASE = 'http://127.0.0.1:8080'

async function getContactSubmissions() {
  const res = await fetch(
    `${FIRESTORE_BASE}/v1/projects/${PROJECT_ID}/databases/(default)/documents/contactSubmissions`
  )
  if (res.status === 404) return []
  const json = await res.json()
  return json.documents ?? []
}

test.beforeEach(async () => {
  await clearFirestore()
})

// ─── Validation ───────────────────────────────────────────────────────────────

test('shows all required field errors when submitting empty form', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: 'Send Message' }).click()

  await expect(page.getByText('Full name is required.')).toBeVisible()
  await expect(page.getByText('Email address is required.')).toBeVisible()
  await expect(page.getByText('Please select an inquiry type.')).toBeVisible()
  await expect(page.getByText('Message is required.')).toBeVisible()
})

test('shows invalid email error for malformed email', async ({ page }) => {
  await page.goto('/contact')
  await page.fill('#email', 'not-an-email')
  await page.getByRole('button', { name: 'Send Message' }).click()

  await expect(page.getByText('Please enter a valid email address.')).toBeVisible()
})

test('shows error when message is fewer than 10 characters', async ({ page }) => {
  await page.goto('/contact')
  await page.fill('#message', 'Too short')
  await page.getByRole('button', { name: 'Send Message' }).click()

  await expect(page.getByText('Message must be at least 10 characters.')).toBeVisible()
})

test('clears field error when user starts typing', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(page.getByText('Full name is required.')).toBeVisible()

  await page.fill('#name', 'J')
  await expect(page.getByText('Full name is required.')).not.toBeVisible()
})

// ─── Happy path ───────────────────────────────────────────────────────────────

test('submits successfully with all required fields and shows success banner', async ({ page }) => {
  await page.goto('/contact')

  await page.fill('#name', 'Jane Doe')
  await page.fill('#email', 'jane@example.com')
  await page.selectOption('#inquiryType', 'General Inquiry')
  await page.fill('#message', 'I would like more information about your services.')

  await page.getByRole('button', { name: 'Send Message' }).click()

  await expect(
    page.getByText("Thank you! Your message has been sent. We'll be in touch soon.")
  ).toBeVisible()
})

test('saves submission to Firestore with correct fields', async ({ page }) => {
  await page.goto('/contact')

  await page.fill('#name', 'John Smith')
  await page.fill('#email', 'john@example.com')
  await page.fill('#phone', '+1 (804) 555-0100')
  await page.selectOption('#inquiryType', 'Admission Interest')
  await page.fill('#message', 'We are interested in admission for a family member.')

  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(
    page.getByText("Thank you! Your message has been sent.")
  ).toBeVisible()

  const docs = await getContactSubmissions()
  expect(docs).toHaveLength(1)

  const fields = docs[0].fields
  expect(fields.name.stringValue).toBe('John Smith')
  expect(fields.email.stringValue).toBe('john@example.com')
  expect(fields.phone.stringValue).toBe('+1 (804) 555-0100')
  expect(fields.inquiryType.stringValue).toBe('Admission Interest')
  expect(fields.message.stringValue).toBe('We are interested in admission for a family member.')
  expect(fields.status.stringValue).toBe('new')
})

test('resets form fields after successful submission', async ({ page }) => {
  await page.goto('/contact')

  await page.fill('#name', 'Jane Doe')
  await page.fill('#email', 'jane@example.com')
  await page.fill('#phone', '+1 (804) 555-0199')
  await page.selectOption('#inquiryType', 'Other')
  await page.fill('#message', 'Just reaching out to say hello and learn more.')

  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(
    page.getByText("Thank you! Your message has been sent.")
  ).toBeVisible()

  await expect(page.locator('#name')).toHaveValue('')
  await expect(page.locator('#email')).toHaveValue('')
  await expect(page.locator('#phone')).toHaveValue('')
  await expect(page.locator('#inquiryType')).toHaveValue('')
  await expect(page.locator('#message')).toHaveValue('')
})

test('submits successfully without optional phone field', async ({ page }) => {
  await page.goto('/contact')

  await page.fill('#name', 'Alice Brown')
  await page.fill('#email', 'alice@example.com')
  // phone intentionally left blank
  await page.selectOption('#inquiryType', 'Visiting Hours')
  await page.fill('#message', 'What are the current visiting hours for residents?')

  await page.getByRole('button', { name: 'Send Message' }).click()

  await expect(
    page.getByText("Thank you! Your message has been sent.")
  ).toBeVisible()

  const docs = await getContactSubmissions()
  expect(docs).toHaveLength(1)
  expect(docs[0].fields.phone.stringValue).toBe('')
})

// ─── All inquiry types ────────────────────────────────────────────────────────

const inquiryTypes = [
  'General Inquiry',
  'Admission Interest',
  'Visiting Hours',
  'Employment',
  'Other',
]

for (const inquiryType of inquiryTypes) {
  test(`submits successfully with inquiry type: ${inquiryType}`, async ({ page }) => {
    await page.goto('/contact')

    await page.fill('#name', 'Test User')
    await page.fill('#email', 'test@example.com')
    await page.selectOption('#inquiryType', inquiryType)
    await page.fill('#message', 'This is a test message for the contact form.')

    await page.getByRole('button', { name: 'Send Message' }).click()

    await expect(
      page.getByText("Thank you! Your message has been sent.")
    ).toBeVisible()

    const docs = await getContactSubmissions()
    expect(docs[0].fields.inquiryType.stringValue).toBe(inquiryType)
  })
}
