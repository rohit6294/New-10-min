import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { sendSilentData } from "./fcm";

const db = admin.firestore();

/**
 * Firestore onUpdate trigger — fires the moment a driver accepts a request
 * (assignedDriverId becomes set).
 *
 * 1. Dismisses the incoming-request alert on every other notified driver.
 * 2. Copies the driver's display details onto the request so the patient's
 *    (unauthenticated) tracking page can show them without reading the
 *    drivers collection directly.
 *
 * NOTE: the driver picks the hospital MANUALLY after pickup, so this
 * function intentionally does NOT auto-search hospitals or change status.
 */
export const onDriverAccept = functions
  .region("asia-south1")
  .firestore.document("rescue_requests/{requestId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const { requestId } = context.params;

    const driverJustAssigned =
      !before.assignedDriverId && after.assignedDriverId;
    if (!driverJustAssigned) return;

    const assignedDriverId = after.assignedDriverId as string;

    // Copy driver display info onto the request (for the tracking page).
    const driverSnap = await db
      .collection("drivers")
      .doc(assignedDriverId)
      .get();
    const driver = driverSnap.data();
    await db.collection("rescue_requests").doc(requestId).update({
      driverName: driver?.name ?? "",
      driverPhone: driver?.phone ?? "",
      driverVehicleNumber: driver?.vehicleNumber ?? "",
      driverAmbulanceType: driver?.ambulanceType ?? "",
    });

    // Dismiss the alert on every other notified driver.
    const notifiedDriverIds = (after.notifiedDriverIds as string[]) || [];
    const cancelTargets = notifiedDriverIds.filter(
      (id) => id !== assignedDriverId
    );
    if (cancelTargets.length === 0) return;

    const tokenSnaps = await Promise.all(
      cancelTargets.map((id) => db.collection("drivers").doc(id).get())
    );
    const cancelTokens = tokenSnaps.map(
      (s) => s.data()?.fcmToken as string | undefined
    );

    await sendSilentData(cancelTokens, {
      type: "request_cancelled",
      requestId,
    });
  });
