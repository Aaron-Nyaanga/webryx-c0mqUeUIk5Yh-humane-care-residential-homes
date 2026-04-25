# Humane Care Residential Homes — Scraped Content
Source: https://humanecareresidentialhomes.com
Scraped: 2026-04-04

---

## Brand & Identity

**Business Name:** Humane Care Residential Homes, LLC
**Tagline:** "Group Homes for Adults with Disabilities"
**Key Quote:** "Home iss not where you live but where they understand you" — Christian Morgenstern

**Logo URL:**
`https://img1.wsimg.com/isteam/ip/c4b9dfa8-0b20-4cbe-9ee1-c309928d05ca/humane-care-logo-eda3f87.png`

**Color Scheme (current site):**
- Primary teal/green: rgb(73, 157, 149) / #499D95
- Dark teal: rgb(56, 122, 116) / #387A74
- Background: white
- Fonts: Playfair Display (headings), Open Sans (body)

---

## Mission & Vision

**Mission Statement:**
"To provide a comfortable and secure environment that enables individuals to enjoy life while supporting independence."

**Vision Statement:**
"To maximize the quality of life for adults with disabilities by providing personalized, high-quality care from the heart in a home-like environment that promotes health and safety."

---

## Core Values / Differentiators

- Compassionate, heart-centered care approach
- Promotes independence and personal choice
- Experienced caregivers and nursing staff
- Safe, comfortable, and secure environments
- Generator backup for continuous power supply
- Home-like atmosphere (not institutional)
- Private bedrooms and accessible bathrooms
- Wheelchair-accessible facilities

---

## Services (inferred from site — expand with real descriptions)

The site focuses on residential group home care for adults with disabilities. Services likely include:
- Personal care assistance (ADLs: bathing, dressing, grooming)
- Medication management and nursing oversight
- Meal preparation and nutrition support
- Transportation assistance
- Social and recreational activities
- 24/7 supervision and support
- Community integration support
- Housekeeping and laundry
- Respite care

> NOTE: The current site does not have a dedicated /services page. These should be confirmed with the client and expanded into detailed descriptions.

---

## Contact Information

**Phone:** +1 (804) 924-4211
**Address:** 9006 Celestial Lane, Chesterfield, Virginia 23832, United States
**Hours:** Monday–Friday: 9:00 AM – 5:00 PM
**Email:** Not publicly listed on the site — confirm with client

---

## Navigation Structure (current site)

- Home
- About Us
- Contact Us
- Careers

---

## Careers Page Content

**Open Positions:**
1. Registered Nurse (RN) — 0 openings currently
2. Licensed Practical Nurse (LPN) — 1 opening (part-time or full-time)
3. Direct Support Professional (DSP) — 1 opening (part-time or full-time)

**Company pitch to applicants:**
"Supportive work environment dedicated to professional growth and work-life balance."
"Make a positive impact in the lives of individuals we serve."
"Build a caring community of support."

**Application Form Fields (current):**
- Full name
- Phone number
- Email address
- Resume attachment (file upload)
- Google reCAPTCHA

---

## Contact Us Page Content

**Form Fields (current):**
- Name
- Email (required)
- Phone
- Message

---

## Images / Assets

**Logo:**
`https://img1.wsimg.com/isteam/ip/c4b9dfa8-0b20-4cbe-9ee1-c309928d05ca/humane-care-logo-eda3f87.png`

**Facility Photos (located in /Pictures folder of the project directory):**
All images should be copied into the React app's `public/images/` folder during build.

| File | Usage Suggestion |
|------|-----------------|
| `widefronthouse.jpg` | Hero background / exterior feature |
| `frontHouseClose.jpg` | About page / facility section |
| `livingroom.jpg` | Gallery / home comfort section |
| `diningroom.jpg` | Gallery / dining section |
| `diningroom2.jpg` | Gallery alternate |
| `kitchen.jpg` | Gallery / amenities |
| `kitchen2.jpg` | Gallery alternate |
| `bedroom1.jpg` | Gallery / private room section |
| `bathroom.jpg` | Gallery / accessible bathroom |
| `balcony.jpg` | Gallery / outdoor space |
| `backyard.jpg` | Gallery / outdoor activities |
| `elderlyPhoto.jpg` | Hero section / about page (care-in-action photo) |

**Source path:** `C:/Users/Aaron/Projects/Sarah Nyaanga/Humane Care Residential Homes/Pictures/`
**Destination in app:** `public/images/`

---

## Email / Admin Setup

- **Admin email:** Provided at runtime via environment variable (`.env`) — same address receives both contact form submissions and career applications
- **Contact form:** Collects user's name, email, phone, message, inquiry type — submitted to Firestore + EmailJS notification to admin
- **Career form:** Collects applicant name, email, phone, position, resume — submitted to Firestore + Firebase Storage (resume) + EmailJS notification to admin

## What's Missing / Needs Client Input

- [ ] Staff names and bios (if client wants staff section)
- [ ] Exact services list confirmed by client (see inferred list above)
- [ ] Any testimonials or family quotes
- [ ] Social media links (Facebook, Instagram, etc.)
- [ ] Admin login email/password for Firebase Auth setup
