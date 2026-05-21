import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

interface CreateAccountData {
  accountType: "hospital" | "fleet" | "driver";
  email: string;
  password: string;
  displayName: string;
  phone?: string;
  // Hospital-specific
  address?: string;
  icuBeds?: number;
  advancedBeds?: number;
  normalBeds?: number;
  // Fleet-specific
  contactPerson?: string;
  // Driver-specific
  vehicleNumber?: string;
  vehicleType?: string;
}

/**
 * Callable Cloud Function: creates a Firebase Auth user and the matching
 * Firestore document (hospital, fleet, or driver). Only callable by admins.
 *
 * Why a Cloud Function?
 * - Client-side createUserWithEmailAndPassword() signs in as the new user,
 *   kicking the admin out of their session. Admin SDK avoids this.
 * - We can write to any Firestore collection with Admin SDK (no rules needed).
 */
export const adminCreateAccount = functions
  .region("asia-south1")
  .https.onCall(async (data: CreateAccountData, context) => {
    // ── Auth guard: caller must be an admin ──
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be signed in."
      );
    }

    const adminDoc = await db.doc(`admins/${context.auth.uid}`).get();
    if (!adminDoc.exists) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can create accounts."
      );
    }

    // ── Validate input ──
    const { accountType, email, password, displayName } = data;
    if (!accountType || !email || !password || !displayName) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "accountType, email, password, and displayName are required."
      );
    }
    if (!["hospital", "fleet", "driver"].includes(accountType)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "accountType must be hospital, fleet, or driver."
      );
    }

    try {
      // ── Create Firebase Auth user ──
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      const uid = userRecord.uid;
      const now = admin.firestore.FieldValue.serverTimestamp();

      // ── Create the role record in users/ ──
      const role = accountType === "fleet" ? "fleet" : accountType;
      await db.doc(`users/${uid}`).set({
        email,
        role,
        createdAt: now,
        createdBy: context.auth.uid,
      });

      // ── Create the entity-specific document ──
      if (accountType === "hospital") {
        await db.doc(`hospitals/${uid}`).set({
          name: displayName,
          email,
          phone: data.phone || "",
          address: data.address || "",
          isActive: true,
          icuBeds: data.icuBeds || 0,
          icuAvailable: data.icuBeds || 0,
          advancedBeds: data.advancedBeds || 0,
          advancedAvailable: data.advancedBeds || 0,
          normalBeds: data.normalBeds || 0,
          normalAvailable: data.normalBeds || 0,
          rating: 0,
          createdAt: now,
          createdBy: context.auth.uid,
        });
      } else if (accountType === "fleet") {
        await db.doc(`ambulance_fleets/${uid}`).set({
          name: displayName,
          email,
          phone: data.phone || "",
          contactPerson: data.contactPerson || displayName,
          address: data.address || "",
          isActive: true,
          ownerUid: uid,
          createdAt: now,
          createdBy: context.auth.uid,
        });
      } else if (accountType === "driver") {
        await db.doc(`drivers/${uid}`).set({
          name: displayName,
          email,
          phone: data.phone || "",
          vehicleNumber: data.vehicleNumber || "",
          vehicleType: data.vehicleType || "BLS",
          verificationStatus: "verified", // admin-created = auto-verified
          isOnline: false,
          isAvailable: true,
          currentTripId: null,
          fleetId: null,
          documents: {},
          createdAt: now,
          createdBy: context.auth.uid,
        });
      }

      return {
        success: true,
        uid,
        message: `${accountType} account created: ${displayName} (${email})`,
      };
    } catch (error: any) {
      if (error.code === "auth/email-already-exists") {
        throw new functions.https.HttpsError(
          "already-exists",
          "An account with this email already exists."
        );
      }
      console.error("adminCreateAccount error:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to create account."
      );
    }
  });
