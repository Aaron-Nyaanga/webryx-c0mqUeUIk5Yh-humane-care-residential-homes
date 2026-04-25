# Project Progress

## Client
Sarah Nyaanga -- Humane Care Residential Homes
Folder: C:/Users/Aaron/Documents/Humane-Care-Residential-Homes/

## Stack
- Frontend: React (Vite) + TailwindCSS + React Router
- Database: Firebase Firestore
- Auth: Firebase Auth
- Storage: Firebase Storage
- Email: EmailJS + Firebase Cloud Functions

## Completed Phases
### Phase 1 -- MVP Shell
- Files: vite.config.js, src/App.jsx, src/main.jsx, src/index.css
- Components: Header.jsx, Footer.jsx
- Pages: Home, About, Services, Contact, Careers, AdminLogin, NotFound (all placeholders)
- Status: QA passed

### Phase 2 -- Home & About Pages
- Files: src/pages/Home.jsx, src/pages/About.jsx
- Status: QA passed

### Phase 3 -- Services & Gallery Pages
- Files: src/pages/Services.jsx, src/pages/Gallery.jsx, src/components/ui/MapEmbed.jsx
- Status: QA passed

### Phase 4 -- Contact Us Form (Firestore + EmailJS)
- Files: src/pages/Contact.jsx, firestore.rules, firestore.schema.md
- Status: QA passed

### Phase 5 -- Careers Page & Resume Upload
- Files: src/pages/Careers.jsx, firestore.rules, storage.rules
- Status: QA passed

### Phase 6 -- Admin Authentication
- Files: src/context/AuthContext.jsx, src/components/auth/ProtectedRoute.jsx, src/pages/AdminLogin.jsx, src/pages/admin/Dashboard.jsx, src/components/layout/Layout.jsx
- Status: QA passed

### Phase 7 -- Admin Dashboard: View Submissions
- Files: src/pages/admin/ContactSubmissions.jsx, src/pages/admin/CareerApplications.jsx, src/pages/admin/Dashboard.jsx
- Status: QA passed

### Phase 8 -- Admin: Approve/Reject Applications + Send Email
- Files: src/components/admin/ApprovalModal.jsx, src/components/admin/RejectionModal.jsx, src/pages/admin/CareerApplications.jsx
- Status: QA passed

### Phase 9 -- Polish, SEO & Final QA
- Files: index.html, src/hooks/usePageTitle.js, src/components/ui/PageLoader.jsx, src/components/ui/ErrorBoundary.jsx, src/pages/NotFound.jsx, src/index.css, all public pages, Header.jsx, Footer.jsx, Layout.jsx, ContactSubmissions.jsx, CareerApplications.jsx
- Status: QA passed

## Current Phase
Phase 10 -- Positions Management + Block Applications (in planning)

## Planned Phases

### Phase 10 -- Positions Management + Block Applications
Size: Medium (1 new collection, 3 components touched, 0 new endpoints -- all client-side Firestore)
Goal: Admin can adjust the number of available positions per job. Careers page reads position counts from Firestore and blocks applications when a job has 0 openings.

#### backend-agent
- New Firestore collection: `jobPositions`
  - Document ID: slug string (e.g., "lpn", "dsp", "rn")
  - Fields:
    - title: string -- display name (e.g., "Licensed Practical Nurse (LPN)")
    - slug: string -- matches doc ID
    - openings: number -- current available positions (>= 0)
    - updatedAt: timestamp
- Update firestore.rules:
  - `jobPositions/{docId}`: allow public read (anyone can see openings count); allow update only if authenticated (admin)
  - On update, only `openings` and `updatedAt` fields may change
- Seed script or documentation: provide a one-time Firestore seeding snippet (can be run in browser console or as a script) to create the 3 initial jobPositions documents with current hardcoded values:
  - { slug: "lpn", title: "Licensed Practical Nurse (LPN)", openings: 1 }
  - { slug: "dsp", title: "Direct Support Professional (DSP)", openings: 1 }
  - { slug: "rn", title: "Registered Nurse (RN)", openings: 0 }
- Update firestore.schema.md with the new collection

#### frontend-agent
Task A -- Admin Positions Management UI:
- Add a new sidebar nav item "Manage Positions" to Dashboard.jsx (NAV_ITEMS array)
- Create new component: src/pages/admin/ManagePositions.jsx
  - Reads all docs from `jobPositions` collection in real time (onSnapshot)
  - Displays each position as a card with: title, current openings count, minus (-) button, plus (+) button
  - Minus button disabled when openings is 0
  - Plus/minus buttons call updateDoc on `jobPositions/{slug}` to increment/decrement `openings` and set `updatedAt` to serverTimestamp()
  - Loading skeleton while data loads
  - Error handling if update fails (inline error message)
- Wire "Manage Positions" tab in Dashboard.jsx to render ManagePositions component

Task B -- Careers page reads from Firestore:
- Update src/pages/Careers.jsx:
  - On mount, fetch all docs from `jobPositions` collection (use onSnapshot for real-time)
  - Replace the hardcoded `positions` array badges/button behavior with dynamic data:
    - Match each position card to its jobPositions doc by title
    - Badge text: "{openings} Opening(s)" or "0 Openings" dynamically
    - Badge style: green if openings > 0, gray if openings === 0
    - If openings === 0: button text changes to "No Openings", button is disabled (not clickable), show italic note "No current openings -- check back later or submit your details to be notified."
    - If openings > 0: button text "Apply Now", button scrolls to form as before
  - In the application form, the position dropdown should only list positions with openings > 0
  - If a user somehow selects a position with 0 openings (edge case), show validation error "This position is no longer accepting applications."
  - Show a loading state while jobPositions data loads

#### qa-agent
- Verify ManagePositions page loads in admin dashboard
- Verify plus/minus buttons update Firestore openings count
- Verify minus button disabled at 0
- Verify Careers page reflects updated openings in real time
- Verify "Apply Now" button disabled/hidden when openings = 0
- Verify position dropdown excludes 0-opening positions
- Verify app builds with no errors
- Verify no console errors on any page

---

### Phase 11 -- Lock Approval/Rejection Status
Size: Small (0 new collections, 2 components touched, 0 endpoints)
Goal: Once an applicant is approved or rejected, that decision is final. Admin cannot change it.

#### backend-agent
- Update firestore.rules for `careerApplications/{docId}`:
  - On update, if the existing document's `status` is "approved" or "rejected", deny the update (status is locked)
  - Allow update only if current status is "new" or "reviewed"

#### frontend-agent
- Update src/pages/admin/CareerApplications.jsx:
  - In DetailPanel, if app.status is "approved" or "rejected":
    - Hide the Approve/Reject/Mark Reviewed buttons entirely
    - Show a small locked status indicator: "Status locked -- [Approved/Rejected] on [date from last statusHistory entry]"
  - The status badge still shows as before (green for approved, red for rejected)
  - No other UI changes needed

#### qa-agent
- Verify that approved applicants show locked status, no action buttons
- Verify that rejected applicants show locked status, no action buttons
- Verify that "new" and "reviewed" applicants still show all action buttons
- Verify Firestore rules block status changes on already-approved/rejected docs
- Verify no console errors
- Verify app builds
