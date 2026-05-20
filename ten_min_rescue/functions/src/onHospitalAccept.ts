import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendAlert } from "./fcm";

const db = admin.firestore();

/**
 * Firestore onUpdate trigger — fires when a hospital is assigned to a
 * request (assignedHospitalId becomes set). This happens when the driver
 * manually picks a hospital after pickup, or when the patient pre-selected
 * one and pickup is confirmed.
 *
 * 1. Copies the hospital's name/address/location onto the request so the
 *    driver navigation + patient tracking screens can display it.
 * 2. Sends a push alert to the chosen hospital so its staff can prepare.
 */
export const onHospitalAccept = functions
  .region("asia-south1")
  .firestore.document("rescue_requests/{requestId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const { requestId } = context.params;

    const hospitalJustAssigned =
      !before.assignedHospitalId && after.assignedHospitalId;
    if (!hospitalJustAssigned) return;

    const assignedHospitalId = after.assignedHospitalId as string;
    const hospitalSnap = await db
      .collection("hospitals")
      .doc(assignedHospitalId)
      .get();
    const hospital = hospitalSnap.data();

    // Copy hospital details onto the request for display on the driver
    // navigation screen and the patient tracking page.
    await db.collection("rescue_requests").doc(requestId).update({
      hospitalName: hospital?.name ?? "",
      hospitalAddress: hospital?.address ?? "",
      hospitalPhone: hospital?.phone ?? "",
      hospitalLocation: hospital?.location ?? null,
      hospitalNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Alert the chosen hospital.
    const patientName = (after.patientName as string) || "A patient";
    const urgency = (after.urgencyLevel as string) || "";
    const urgencyLabel =
      urgency === "critical"
        ? "CRITICAL"
        : urgency === "serious"
          ? "SERIOUS"
          : "Incoming";

    await sendAlert([hospital?.fcmToken as string | undefined], {
      type: "incoming_ambulance",
      requestId,
      title: `${urgencyLabel}: ambulance inbound`,
      body: `${patientName} is being brought to your hospital. Tap to prepare.`,
    });
  });
