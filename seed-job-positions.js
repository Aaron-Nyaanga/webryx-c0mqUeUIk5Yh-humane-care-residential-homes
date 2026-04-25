// seed-job-positions.js
// One-time script to seed the jobPositions collection in Firestore.
//
// Prerequisites:
//   1. Install firebase-admin: npm install firebase-admin
//   2. Download your Firebase service account key:
//      Firebase Console → Project Settings → Service Accounts → Generate new private key
//      Save it as serviceAccountKey.json in the same folder as this script.
//   3. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of that file:
//      Windows (PowerShell): $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json"
//      Mac/Linux:            export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
//   4. Run: node seed-job-positions.js
//
// This script is safe to re-run — it uses set() with merge: false, so it will
// overwrite any existing documents at these IDs.

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'humane-care-residential-homes',
});

const db = admin.firestore();

const positions = [
  {
    slug: 'lpn',
    title: 'Licensed Practical Nurse (LPN)',
    openings: 1,
  },
  {
    slug: 'dsp',
    title: 'Direct Support Professional (DSP)',
    openings: 1,
  },
  {
    slug: 'rn',
    title: 'Registered Nurse (RN)',
    openings: 0,
  },
];

async function seed() {
  const batch = db.batch();

  for (const position of positions) {
    const ref = db.collection('jobPositions').doc(position.slug);
    batch.set(ref, {
      slug: position.slug,
      title: position.title,
      openings: position.openings,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log('Seeded jobPositions: lpn, dsp, rn');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
