import 'package:cloud_firestore/cloud_firestore.dart';

class SosRequestModel {
  final String id;
  final double latitude;
  final double longitude;
  final String mapsLink;
  final String status; // pending | assigned | resolved
  final String? driverId;
  final DateTime? createdAt;

  // New fields (from upgraded SOS wizard)
  final String ambulanceType; // 'A' | 'B' | 'C'
  final String urgencyLevel; // 'critical' | 'serious' | 'stable'
  final String emergencyDescription;
  final String? preferredHospitalId;
  final String patientName;
  final String patientPhone;

  const SosRequestModel({
    required this.id,
    required this.latitude,
    required this.longitude,
    required this.mapsLink,
    required this.status,
    this.driverId,
    this.createdAt,
    this.ambulanceType = 'C',
    this.urgencyLevel = 'stable',
    this.emergencyDescription = '',
    this.preferredHospitalId,
    this.patientName = '',
    this.patientPhone = '',
  });

  factory SosRequestModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    return SosRequestModel(
      id: doc.id,
      latitude: (data['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (data['longitude'] as num?)?.toDouble() ?? 0.0,
      mapsLink: data['mapsLink'] as String? ?? '',
      status: data['status'] as String? ?? 'pending',
      driverId: data['driverId'] as String?,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      ambulanceType: data['ambulanceType'] as String? ?? 'C',
      urgencyLevel: data['urgencyLevel'] as String? ?? 'stable',
      emergencyDescription:
          data['emergencyDescription'] as String? ?? '',
      preferredHospitalId: data['preferredHospitalId'] as String?,
      patientName: data['patientName'] as String? ?? '',
      patientPhone: data['patientPhone'] as String? ?? '',
    );
  }
}
