/**
 * Firebase Configuration for Chrome Extension
 * Initializes Firebase in the extension context
 */

// Import Firebase modules
// Note: These are available in the browser context
// Include Firebase via a CDN in the extension or bundle them

// Firebase configuration (Same as React app)
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

/**
 * Initialize Firebase in extension
 * Must be called before using Firestore
 */
export async function initializeExtensionFirebase() {
  // Firebase will be initialized via CDN
  // This function is a placeholder for future setup logic
  console.log("Firebase initialized for extension");
}

/**
 * Save browser scan result to Firestore
 * Called from popup when analysis is complete
 */
export async function saveBrowserScanToFirestore(scanData: {
  url: string;
  hostname: string;
  browserTitle: string;
  favicon: string;
  trustScore: number;
  threatLevel: string;
  phishingRisk: number;
  manipulationScore: number;
  riskFactors: string[];
  aiExplanation: string;
}) {
  try {
    // Get Firestore reference
    const db = window.firebase?.firestore?.();

    if (!db) {
      throw new Error("Firestore not initialized");
    }

    // Add document to browser_scans collection
    const docRef = await db.collection("browser_scans").add({
      ...scanData,
      scannedAt: window.firebase?.firestore?.Timestamp.now?.(),
      userId: await getCurrentUserId(), // Optional: get current user ID
    });

    console.log("Scan saved to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    throw error;
  }
}

/**
 * Get current user ID from Firebase Auth
 * Optional - only if user is authenticated
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const auth = window.firebase?.auth?.();
    return auth?.currentUser?.uid || null;
  } catch {
    return null;
  }
}
