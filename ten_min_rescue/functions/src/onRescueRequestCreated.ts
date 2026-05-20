import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { findNearbyDriversInternal } from "./findNearbyDrivers";

/**
 * Firestore onCreate trigger — fires the moment a patient's rescue request
 * is created (from the web SOS page, WhatsApp, or the driver/admin app).
 * It immediately starts the nearby-driver search + push-notification
 * pipeline.
 *
 * This is the trigger that was missing: without it, `findNearbyDrivers`
 * (an HTTPS-callable) was never invoked, so no driver was ever notified.
 */
export const onRescueRequestCreated = functions
  .region("asia-south1")
  .firestore.document("rescue_requests/{requestId}")
  .onCreate(async (snap, context) => {
    const request = snap.data();
    const { requestId } = context.params;

    // Only dispatch requests that are still waiting for a driver.
    if (request.status && request.status !== "pending_driver") return;

    const loc = request.patientLocation as
      | admin.firestore.GeoPoint
      | undefined;
    if (!loc) {
      console.error(
        `Request ${requestId} has no patientLocation — cannot dispatch`
      );
      return;
    }

    const startRadius = (request.currentDriverSearchRadius as number) || 1;

    await findNearbyDriversInternal({
      requestId,
      lat: loc.latitude,
      lng: loc.longitude,
      searchRadius: startRadius,
      alreadyNotified: (request.notifiedDriverIds as string[]) || [],
    });
  });
