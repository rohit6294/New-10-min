import 'package:cloud_firestore/cloud_firestore.dart';
import 'ambulance_type.dart';

class DriverModel {
  final String uid;
  final String name;
  final String phone;
  final String vehicleNumber;
  final String licenseNumber;
  final AmbulanceType ambulanceType;
  final String fcmToken;
  final bool isOnline;
  final bool isAvailable;
  final GeoPoint? location;
  final String geohash;
  final String? currentRequestId;
  final String verificationStatus; // 'pending' | 'verified' | 'rejected'
  final String rejectionReason;
  final Map<String, String> documents; // docType → downloadUrl
  final String? fleetId; // uid of the NGO / ambulance admin this driver belongs to

  const DriverModel({
    required this.uid,
    required this.name,
    required this.phone,
    this.vehicleNumber = '',
    this.licenseNumber = '',
    this.ambulanceType = AmbulanceType.C,
    this.fcmToken = '',
    this.isOnline = false,
    this.isAvailable = true,
    this.location,
    this.geohash = '',
    this.currentRequestId,
    this.verificationStatus = 'pending',
    this.rejectionReason = '',
    this.documents = const {},
    this.fleetId,
  });

  factory DriverModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    return DriverModel(
      uid: doc.id,
      name: data['name'] ?? '',
      phone: data['phone'] ?? '',
      vehicleNumber: data['vehicleNumber'] ?? '',
      licenseNumber: data['licenseNumber'] ?? '',
      ambulanceType:
          AmbulanceTypeX.fromString(data['ambulanceType'] as String?),
      fcmToken: data['fcmToken'] ?? '',
      isOnline: data['isOnline'] ?? false,
      isAvailable: data['isAvailable'] ?? true,
      location: data['location'] as GeoPoint?,
      geohash: data['geohash'] ?? '',
      currentRequestId: data['currentRequestId'],
      verificationStatus: data['verificationStatus'] ?? 'pending',
      rejectionReason: data['rejectionReason'] ?? '',
      documents: (data['documents'] as Map<String, dynamic>?)
              ?.map((k, v) => MapEntry(k, v.toString())) ??
          const {},
      fleetId: data['fleetId'] as String?,
    );
  }

  Map<String, dynamic> toFirestore() => {
        'uid': uid,
        'name': name,
        'phone': phone,
        'vehicleNumber': vehicleNumber,
        'licenseNumber': licenseNumber,
        'ambulanceType': ambulanceType.value,
        'fcmToken': fcmToken,
        'isOnline': isOnline,
        'isAvailable': isAvailable,
        if (location != null) 'location': location,
        'geohash': geohash,
        'currentRequestId': currentRequestId,
        'lastLocationUpdate': FieldValue.serverTimestamp(),
        'verificationStatus': verificationStatus,
        'rejectionReason': rejectionReason,
        'documents': documents,
        if (fleetId != null) 'fleetId': fleetId,
      };

  DriverModel copyWith({
    bool? isOnline,
    bool? isAvailable,
    GeoPoint? location,
    String? geohash,
    String? currentRequestId,
    String? fcmToken,
    String? verificationStatus,
    String? rejectionReason,
    Map<String, String>? documents,
    AmbulanceType? ambulanceType,
  }) =>
      DriverModel(
        uid: uid,
        name: name,
        phone: phone,
        vehicleNumber: vehicleNumber,
        licenseNumber: licenseNumber,
        ambulanceType: ambulanceType ?? this.ambulanceType,
        fcmToken: fcmToken ?? this.fcmToken,
        isOnline: isOnline ?? this.isOnline,
        isAvailable: isAvailable ?? this.isAvailable,
        location: location ?? this.location,
        geohash: geohash ?? this.geohash,
        currentRequestId: currentRequestId ?? this.currentRequestId,
        verificationStatus: verificationStatus ?? this.verificationStatus,
        rejectionReason: rejectionReason ?? this.rejectionReason,
        documents: documents ?? this.documents,
      );
}
