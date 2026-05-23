import mongoose from 'mongoose';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'travelsphere-544e3'
    });
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

const seedAdmin = async () => {
  const email = "admin@travelsphere.com";
  const password = "Admin@123456";
  const name = "Super Admin";

  console.log("========================================");
  console.log("  TravelSphere Admin Setup");
  console.log("========================================\n");

  let uid = null;

  // Step 1: Try to get user from Firebase Auth
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    uid = userRecord.uid;
    console.log("ℹ️  Admin user already exists in Firebase Auth.");
    
    // Update password just in case
    await admin.auth().updateUser(uid, { password });
    console.log("✅ Updated password in Firebase Auth.");
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      try {
        const userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: name,
        });
        uid = userRecord.uid;
        console.log("✅ Created new Firebase Auth user.");
      } catch (createError) {
        console.error("❌ Failed to create Firebase Auth user:", createError.message);
        process.exit(1);
      }
    } else {
      console.error("❌ Error fetching Firebase Auth user:", error.message);
      process.exit(1);
    }
  }

  // Step 2: Update Firestore 'users' collection with role 'admin'
  console.log(`   UID: ${uid}`);
  console.log("   Writing admin data to Firestore...");

  try {
    const db = admin.firestore();
    await db.collection("users").doc(uid).set({
      uid: uid,
      name: name,
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: null
    }, { merge: true });

    console.log("✅ Admin document saved to Firestore 'users' collection.\n");
    console.log("========================================");
    console.log("  🎉 ADMIN ACCOUNT READY!");
    console.log("========================================");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role:     admin`);
    console.log(`  UID:      ${uid}`);
    console.log("========================================");
    
    process.exit(0);
  } catch (firestoreError) {
    console.error("❌ Failed to write to Firestore:", firestoreError.message);
    process.exit(1);
  }
};

seedAdmin();
