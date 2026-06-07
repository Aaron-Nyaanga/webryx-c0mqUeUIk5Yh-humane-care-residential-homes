"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendRejectionEmail = exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendApprovalEmail = exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendCareerEmail = exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendContactEmail = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
admin.initializeApp();
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}
// ─── 1. Contact Form Email ───────────────────────────────────────────────────
exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendContactEmail = functions.https.onCall(async (data, context) => {
    const { name, email, phone, inquiryType, message } = data;
    if (!name || !email || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }
    const transporter = createTransporter();
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
    });
    return { success: true };
});
// ─── 2. Career Application Email ─────────────────────────────────────────────
exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendCareerEmail = functions.https.onCall(async (data, context) => {
    const { name, email, phone, position, experience, preferredShifts, message, resumeUrl } = data;
    const shiftsDisplay = Array.isArray(preferredShifts) && preferredShifts.length > 0
        ? preferredShifts.join(', ')
        : (data.preferredShift || 'No preference');
    if (!name || !email || !position) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }
    const transporter = createTransporter();
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
            <tr><td style="padding: 8px 0; color: #666;"><strong>Preferred Shifts</strong></td><td style="padding: 8px 0;">${shiftsDisplay}</td></tr>
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
    });
    return { success: true };
});
// ─── 3. Approval Email to Applicant ──────────────────────────────────────────
exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendApprovalEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
    }
    const { toEmail, position, subject, message } = data;
    if (!toEmail || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }
    const transporter = createTransporter();
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
    });
    return { success: true };
});
// ─── 4. Rejection Email to Applicant ─────────────────────────────────────────
exports.CGE0MOVxp3Vb_Wry9mKq4xPn2_sendRejectionEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
    }
    const { toEmail, subject, message } = data;
    if (!toEmail || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }
    const transporter = createTransporter();
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
    });
    return { success: true };
});
//# sourceMappingURL=index.js.map