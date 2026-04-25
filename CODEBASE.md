# Codebase Index

## App Root
- humane-care-web/ — Vite + React app

## Context
- AuthContext — src/context/AuthContext.jsx — provides currentUser state and loading flag via Firebase onAuthStateChanged

## Components
- Header — src/components/layout/Header.jsx — logo, 6 nav links (Home, About, Services, Gallery, Contact, Careers), mobile hamburger, teal bg, ARIA labels, aria-current on active link, dynamic hamburger aria-label
- Footer — src/components/layout/Footer.jsx — address, phone, hours, dark teal bg, dynamic copyright year, role=contentinfo
- Layout — src/components/layout/Layout.jsx — wraps public pages with Header + Footer via Outlet, main content wrapped in ErrorBoundary
- MapEmbed — src/components/ui/MapEmbed.jsx — embedded Google Map iframe, placeholder coordinates (verify before launch)
- ProtectedRoute — src/components/auth/ProtectedRoute.jsx — redirects unauthenticated users to /admin/login, renders Outlet if authed

## Components/ui
- PageLoader — src/components/ui/PageLoader.jsx — full-page loading spinner for async states
- ErrorBoundary — src/components/ui/ErrorBoundary.jsx — catches React render errors and displays a fallback UI

## Components/admin
- ApprovalModal — src/components/admin/ApprovalModal.jsx — teal modal with editable subject + message, EmailJS approval email to applicant, calls onSent(message) on success
- RejectionModal — src/components/admin/RejectionModal.jsx — rose modal with editable subject + message, EmailJS rejection email to applicant, calls onSent(message) on success

## Pages
- Home — src/pages/Home.jsx — Hero, Services grid, Why Choose Us, Photo strip, CTA
- About — src/pages/About.jsx — Page hero, Mission/Vision, Who We Are, Facility highlights, Core Values, CTA
- Services — src/pages/Services.jsx — 5 sections, 8 service cards covering residential care offerings
- Gallery — src/pages/Gallery.jsx — 12-photo facility gallery
- Contact — src/pages/Contact.jsx — 3 sections — hero, contact info + map, inquiry form with Firestore write + EmailJS notification
- Careers — src/pages/Careers.jsx — 4 sections — hero, benefits, 3 job cards (LPN/DSP/RN), application form with Firebase Storage resume upload + Firestore write + EmailJS notification
- AdminLogin — src/pages/AdminLogin.jsx — branded login form, redirects to dashboard if already authed
- NotFound — src/pages/NotFound.jsx — polished 404 with Go Home + Contact Us buttons

## Pages/admin
- Dashboard — src/pages/admin/Dashboard.jsx — summary cards with live Firestore counts, tab navigation to ContactSubmissions and CareerApplications views
- ContactSubmissions — src/pages/admin/ContactSubmissions.jsx — real-time Firestore list, filter tabs (all/new/reviewed), mark reviewed, expandable message
- CareerApplications — src/pages/admin/CareerApplications.jsx — real-time Firestore list, filter tabs (all/new/reviewed/approved/rejected), resume download, expandable detail; Approve/Reject buttons open modals; Firestore status update with try/catch in handleApprovalSent and handleRejectionSent

## Hooks
- usePageTitle — src/hooks/usePageTitle.js — sets document.title dynamically per page for SEO and browser tab clarity

## Firebase
- config — src/firebase/config.js — exports app, auth, db, storage

## Firestore Collections
- contactSubmissions — name, email, phone, subject, message, createdAt; public write allowed via firestore.rules
- careerApplications — applicant details, position, resume URL (Storage ref), createdAt, status, statusHistory; public write allowed via firestore.rules

## Storage
- storage.rules — allows public upload to resumes/ path (PDF/DOC/DOCX, size-limited); admin read allowed

## Schema Documentation
- firestore.schema.md — documents all Firestore collection schemas

## Routes
- / → Layout wrapper
  - / → Home
  - /about → About
  - /services → Services
  - /gallery → Gallery
  - /contact → Contact
  - /careers → Careers
- /admin/login → AdminLogin
- /admin → ProtectedRoute wrapper
  - /admin/dashboard → Dashboard
- * → NotFound

Note: App.jsx now uses Layout-based nested routing for public pages.

## Assets
- public/images/ — 12 facility photos (widefronthouse, frontHouseClose, livingroom, diningroom, diningroom2, kitchen, kitchen2, bedroom1, bathroom, balcony, backyard, elderlyPhoto)

## Config Files
- index.html — Google Fonts (Playfair Display, Open Sans) loaded via link tags, SEO meta tags (description, Open Graph, viewport)
- .env.example — 13 environment variable keys: Firebase config (7), EmailJS service ID, public key, contact template ID, career template ID, approval template ID, rejection template ID
- firestore.rules — allows public create on contactSubmissions and careerApplications; admin read/update on both collections; deny-all otherwise
- storage.rules — allows public upload to resumes/ path with file type and size restrictions; admin read allowed
- firebase.json — Firebase Hosting → humane-care-web/dist

## Styling
- src/index.css — Tailwind directives + font-family rules for Google Fonts + smooth scroll behavior

## Deployment Notes

### Environment Variables Required
Copy .env.example to .env and fill in all 13 keys before deploying:
- Firebase project credentials (6 VITE_FIREBASE_* keys)
- EmailJS credentials (5 keys: service ID, 4 template IDs, public key)
- VITE_ADMIN_EMAIL — the admin's email address for receiving submissions

### EmailJS Templates Needed (4 templates)
1. Contact form notification (VITE_EMAILJS_CONTACT_TEMPLATE_ID) — variables: from_name, from_email, phone, inquiry_type, message, to_email
2. Career application notification (VITE_EMAILJS_CAREER_TEMPLATE_ID) — variables: applicant_name, applicant_email, applicant_phone, position, experience, cover_message, resume_url, to_email
3. Approval email to applicant (VITE_EMAILJS_APPROVAL_TEMPLATE_ID) — variables: to_name, to_email, position, subject, message, from_name
4. Rejection email to applicant (VITE_EMAILJS_REJECTION_TEMPLATE_ID) — variables: to_name, to_email, position, subject, message, from_name

### Firebase Setup Required
1. Create Firebase project at console.firebase.google.com
2. Enable Firestore Database (production mode)
3. Enable Firebase Authentication (Email/Password provider)
4. Enable Firebase Storage
5. Deploy firestore.rules and storage.rules: `firebase deploy --only firestore:rules,storage`
6. Create admin user in Firebase Console → Authentication → Add User
7. Deploy site: `cd humane-care-web && npm run build && firebase deploy`

### Google Maps Embed
The MapEmbed component uses a placeholder coordinate URL. For accurate pin placement, generate a proper embed URL from Google Maps for "9006 Celestial Lane, Chesterfield, VA 23832" and update src/components/ui/MapEmbed.jsx.
