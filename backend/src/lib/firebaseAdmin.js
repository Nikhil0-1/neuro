const admin = require('firebase-admin');

// Ensure you have downloaded a service account key JSON from Firebase Console
// For local testing without a key, you can mock this or rely on application default credentials,
// but for production you need the key.

try {
  // If we have a local serviceAccountKey file (recommended for backend dev)
  const serviceAccount = require('../../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (e) {
  // Fallback if no file exists (to prevent crash, but auth won't work correctly until configured)
  console.log("⚠️ Firebase Admin: serviceAccountKey.json not found. Assuming Default Credentials or Mock Mode.");
  admin.initializeApp();
}

module.exports = admin;
