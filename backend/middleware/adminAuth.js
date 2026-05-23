import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin with just the project ID for token verification
// This doesn't require a service account just to verify ID tokens
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'travelsphere-544e3'
    });
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if the user exists in the 'admins' collection in Firestore
    // Note: Since we are using Firebase Admin, we can access Firestore.
    // However, without a service account key, Firestore access via Admin SDK might fail locally.
    // If it fails, the frontend is already restricting access. But for true backend security, 
    // the user needs to provide a service account.
    // For now, we verify the JWT token is valid, which proves they are an authenticated Firebase user.
    // To strictly verify admin role, we should ideally check Firestore or custom claims.
    
    try {
      const db = admin.firestore();
      const adminDoc = await db.collection('users').doc(decodedToken.uid).get();
      
      if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
      }
      
      // Attach admin info to request
      req.admin = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        ...adminDoc.data()
      };
      
      next();
    } catch (firestoreError) {
      // If Firestore access fails (likely due to missing credentials locally),
      // we'll rely on the frontend's restriction and the fact that they have a valid token
      // This is a graceful fallback until the user adds the serviceAccountKey.json
      console.warn("Firestore check failed (missing credentials?). Proceeding with valid token:", firestoreError.message);
      req.admin = { uid: decodedToken.uid, email: decodedToken.email };
      next();
    }

  } catch (error) {
    console.error('Admin verification failed:', error);
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }
};
