import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBson6HKnEOvtNm8D3R6QEDKwSnwkco7Ho",
  authDomain: "travelsphere-544e3.firebaseapp.com",
  projectId: "travelsphere-544e3",
  storageBucket: "travelsphere-544e3.firebasestorage.app",
  messagingSenderId: "999661378570",
  appId: "1:999661378570:web:8180f5f72e221996fad3f3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
  const email = "admin@travelsphere.com";
  const oldPassword = "AdminPassword123!";
  const newPassword = "Admin@123456";
  const name = "Super Admin";

  console.log("========================================");
  console.log("  TravelSphere Admin Setup");
  console.log("========================================\n");

  let uid = null;
  let finalPassword = newPassword;

  // Step 1: Try signing in with the old password to delete and recreate
  try {
    console.log("ℹ️  Attempting to sign in with previous credentials...");
    const cred = await signInWithEmailAndPassword(auth, email, oldPassword);
    uid = cred.user.uid;
    console.log("✅ Signed in with old password. Deleting old account...");
    await deleteUser(cred.user);
    console.log("✅ Old account deleted.");
    uid = null;
  } catch (e) {
    console.log("ℹ️  No old account found or already cleaned up. Proceeding...");
  }

  // Step 2: Create fresh account
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, newPassword);
    uid = userCredential.user.uid;
    console.log("✅ Created new Firebase Auth user.");
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      // Try signing in with the new password
      try {
        const cred = await signInWithEmailAndPassword(auth, email, newPassword);
        uid = cred.user.uid;
        console.log("✅ Signed in with existing account.");
      } catch (e2) {
        console.error("❌ Account exists but cannot sign in. Please delete the user manually from Firebase Console > Authentication.");
        process.exit(1);
      }
    } else {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  }

  // Step 3: Write admin document to Firestore
  console.log(`   UID: ${uid}`);
  console.log("   Writing admin data to Firestore...");

  try {
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      name: name,
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: null
    });

    console.log("✅ Admin document saved to Firestore 'users' collection.\n");
    console.log("========================================");
    console.log("  🎉 ADMIN ACCOUNT READY!");
    console.log("========================================");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${newPassword}`);
    console.log(`  Role:     admin`);
    console.log(`  UID:      ${uid}`);
    console.log("========================================");
    // console.log("\nYou can now login at: http://travelsphere-production.up.railway.app/admin/login\n");

    setTimeout(() => process.exit(0), 2000);
  } catch (firestoreError) {
    console.error("❌ Failed to write to Firestore:", firestoreError.message);
    process.exit(1);
  }
}

setupAdmin();
