import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'

admin.initializeApp()

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// ─── 1. Contact Form Email ───────────────────────────────────────────────────
export const c0mqUeUIk5Yh_Wry9mKq4xPn2_sendContactEmail = functions.https.onCall(async (data: any, context) => {
  const { name, email, phone, inquiryType, message } = data

  if (!name || !email || !message) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields')
  }

  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Humane Care Website" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Inquiry: ${inquiryType || 'General'} from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #499D95; padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0;">Humane Care Residential Homes</p>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name</strong></td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Phone</strong></td><td style="padding: 8px 0;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Inquiry Type</strong></td><td style="padding: 8px 0;">${inquiryType || 'General'}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <p style="color: #666; margin: 0 0 8px;"><strong>Message:</strong></p>
          <p style="background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e5e5; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  })

  return { success: true }
})

// ─── 2. Career Application Email ─────────────────────────────────────────────
export const c0mqUeUIk5Yh_Wry9mKq4xPn2_sendCareerEmail = functions.https.onCall(async (data: any, context) => {
  const { name, email, phone, position, experience, message, resumeUrl } = data

  if (!name || !email || !position) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields')
  }

  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Humane Care Website" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Application: ${position} — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #499D95; padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">New Career Application</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0;">Humane Care Residential Homes</p>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name</strong></td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Phone</strong></td><td style="padding: 8px 0;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Position</strong></td><td style="padding: 8px 0;"><strong>${position}</strong></td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Experience</strong></td><td style="padding: 8px 0;">${experience || 'Not specified'}</td></tr>
          </table>
          ${message ? `
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <p style="color: #666; margin: 0 0 8px;"><strong>Cover Letter:</strong></p>
          <p style="background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e5e5; margin: 0; white-space: pre-wrap;">${message}</p>
          ` : ''}
          ${resumeUrl ? `
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <a href="${resumeUrl}" style="display: inline-block; background: #499D95; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Resume</a>
          ` : ''}
        </div>
      </div>
    `,
  })

  return { success: true }
})

// ─── 3. Approval Email to Applicant ──────────────────────────────────────────
export const c0mqUeUIk5Yh_Wry9mKq4xPn2_sendApprovalEmail = functions.https.onCall(async (data: any, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated')
  }

  const { toEmail, position, subject, message } = data

  if (!toEmail || !message) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields')
  }

  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Humane Care Residential Homes" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: subject || `Your Application at Humane Care Residential Homes — ${position}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #499D95; padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">Humane Care Residential Homes</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0;">9006 Celestial Lane, Chesterfield, VA 23832</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
          <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
        </div>
      </div>
    `,
  })

  return { success: true }
})

// ─── 4. Rejection Email to Applicant ─────────────────────────────────────────
export const c0mqUeUIk5Yh_Wry9mKq4xPn2_sendRejectionEmail = functions.https.onCall(async (data: any, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated')
  }

  const { toEmail, subject, message } = data

  if (!toEmail || !message) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields')
  }

  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Humane Care Residential Homes" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: subject || `Regarding Your Application at Humane Care Residential Homes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #387A74; padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">Humane Care Residential Homes</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0;">9006 Celestial Lane, Chesterfield, VA 23832</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5;">
          <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
        </div>
      </div>
    `,
  })

  return { success: true }
})
