import 'package:cloud_firestore/cloud_firestore.dart';

class CallbackRequestModel {
  final String id;
  final String patientName;
  final String patientPhone;
  final String emergencyDescription;
  final String ambulanceType;
  final String urgencyLevel;
  final String status; // pending_call | called | converted | cancelled
  final String adminNote;
  final DateTime? createdAt;
  final DateTime? calledAt;
  final String? convertedRequestId;

  const CallbackRequestModel({
    required this.id,
    required this.patientName,
    required this.patientPhone,
    this.emergencyDescription = '',
    this.ambulanceType = 'C',
    this.urgencyLevel = 'stable',
    this.status = 'pending_call',
    this.adminNote = '',
    this.createdAt,
    this.calledAt,
    this.convertedRequestId,
  });

  factory CallbackRequestModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    return CallbackRequestModel(
      id: doc.id,
      patientName: data['patientName'] as String? ?? '',
      patientPhone: data['patientPhone'] as String? ?? '',
      emergencyDescription: data['emergencyDescription'] as String? ?? '',
      ambulanceType: data['ambulanceType'] as String? ?? 'C',
      urgencyLevel: data['urgencyLevel'] as String? ?? 'stable',
      status: data['status'] as String? ?? 'pending_call',
      adminNote: data['adminNote'] as String? ?? '',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      calledAt: (data['calledAt'] as Timestamp?)?.toDate(),
      convertedRequestId: data['convertedRequestId'] as String?,
    );
  }
}
