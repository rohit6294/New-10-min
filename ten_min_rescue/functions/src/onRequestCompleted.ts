import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Firestore onUpdate trigger — when a request becomes `completed`, free a
 * bed of the matching type at the receiving hospital (the ambulance has
 * delivered the patient). Runs server-side so drivers never need write
 * access to hospital documents.
 */
export const onRequestCompleted = functions
  .region("asia-south1")
  .firestore.document("rescue_requests/{requestId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === "completed" || after.status !== "completed") return;

    const hospitalId = after.assignedHospitalId as string | undefined;
    if (!hospitalId) return;

    const ambType = (after.ambulanceType as string) || "C";
    const field =
      ambType === "A"
        ? "icuAvailable"
        : ambType === "B"
          ? "advancedAvailable"
          : "normalAvailable";

    await db.runTransaction(async (tx) => {
      const ref = db.collection("hospitals").doc(hospitalId);
      const snap = await tx.get(ref);
      if (!snap.exists) return;
      const current = (snap.data()?.[field] as number) ?? 0;
      tx.update(ref, { [field]: Math.max(0, current - 1) });
    });
  });
