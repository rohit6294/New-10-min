import * as admin from "firebase-admin";
admin.initializeApp();

// Export all functions
export { onRescueRequestCreated } from "./onRescueRequestCreated";
export { findNearbyDrivers } from "./findNearbyDrivers";
export { onDriverAccept } from "./onDriverAccept";
export { onDriverTimeout } from "./onDriverTimeout";
export { findNearbyHospitals } from "./findNearbyHospitals";
export { onHospitalAccept } from "./onHospitalAccept";
export { onHospitalTimeout } from "./onHospitalTimeout";
export { onRequestCompleted } from "./onRequestCompleted";
export { updateDriverLocation } from "./updateDriverLocation";
export { joinFleetByCode } from "./joinFleetByCode";
export { adminCreateAccount } from "./adminCreateAccount";
