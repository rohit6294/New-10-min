import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Callable: a driver, signed in to the mobile app, submits a 6-char fleet
 * join code. We look up the matching `ambulance_fleets` doc and set
 * `fleetId` + `fleetName` on the driver record.
 *
 * Doing this server-side keeps the Firestore rules tight — drivers cannot
 * write an arbitrary `fleetId` to their own doc; the link only happens here
 * after the code is validated.
 */
export const joinFleetByCode = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Sign in as a driver first."
      );
    }

    const uid = context.auth.uid;
    const code = String(data?.code ?? "").trim().toUpperCase();
    if (code.length !== 6) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Code must be 6 characters."
      );
    }

    // Caller must have a driver profile.
    const driverRef = db.collection("drivers").doc(uid);
    const driverSnap = await driverRef.get();
    if (!driverSnap.exists) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only registered drivers can join a fleet."
      );
    }

    // Find the matching fleet.
    const fleetQuery = await db
      .collection("ambulance_fleets")
      .where("joinCode", "==", code)
      .limit(1)
      .get();

    if (fleetQuery.empty) {
      throw new functions.https.HttpsError(
        "not-found",
        "No fleet found with that code. Ask your NGO for a fresh code."
      );
    }

    const fleetDoc = fleetQuery.docs[0];
    const fleet = fleetDoc.data();

    await driverRef.update({
      fleetId: fleetDoc.id,
      fleetName: fleet.name ?? "",
      fleetLinkedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      ok: true,
      fleetId: fleetDoc.id,
      fleetName: fleet.name ?? "",
    };
  });
