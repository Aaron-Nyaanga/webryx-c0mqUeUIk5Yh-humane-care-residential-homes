## jobPositions

Each document represents an open job position displayed on the Careers page.

Document ID: slug string (e.g. "lpn", "dsp", "rn")

Fields:
- title: string — display name (e.g. "Licensed Practical Nurse (LPN)")
- slug: string — matches the document ID
- openings: number — number of available positions, minimum 0
- updatedAt: timestamp — server timestamp, updated when openings change

## contactSubmissions

Each document represents a contact form submission from the public website.

Fields:
- name: string — full name of the person submitting
- email: string — their email address
- phone: string — their phone number (optional)
- inquiryType: string — one of: "General Inquiry", "Admission Interest", "Visiting Hours", "Employment", "Other"
- message: string — their message
- status: string — "new" (default on create)
- createdAt: timestamp — server timestamp on creation

## careerApplications

Each document represents a career application submitted through the Careers page.

Fields:
- name: string — applicant's full name
- email: string — applicant's email address
- phone: string — applicant's phone number
- position: string — one of: "Registered Nurse (RN)", "Licensed Practical Nurse (LPN)", "Direct Support Professional (DSP)"
- experience: string — years of experience
- message: string — cover letter / additional info (optional)
- resumeUrl: string — Firebase Storage download URL for the uploaded resume
- status: string — "new" | "reviewed" | "approved" | "rejected" (default: "new")
- statusHistory: array — log of status changes: [{ status, message, changedAt }]
- createdAt: timestamp — server timestamp on creation
