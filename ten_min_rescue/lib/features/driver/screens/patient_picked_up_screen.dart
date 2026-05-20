import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/services/firestore_service.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/loading_overlay.dart';

class PatientPickedUpScreen extends StatefulWidget {
  final String requestId;
  const PatientPickedUpScreen({super.key, required this.requestId});

  @override
  State<PatientPickedUpScreen> createState() => _PatientPickedUpScreenState();
}

class _PatientPickedUpScreenState extends State<PatientPickedUpScreen> {
  final _firestoreService = FirestoreService();
  bool _loading = false;

  Future<void> _confirm() async {
    setState(() => _loading = true);
    try {
      // Confirm pickup; FirestoreService routes hospital based on patient choice
      await _firestoreService.confirmPatientPickup(widget.requestId);
      if (!mounted) return;
      // Re-fetch the request to determine next route
      final updated = await _firestoreService.getRequest(widget.requestId);
      if (!mounted) return;
      if (updated?.assignedHospitalId != null &&
          updated!.assignedHospitalId!.isNotEmpty) {
        // Patient pre-selected hospital → straight to navigation
        context.go('/driver/navigate-hospital/${widget.requestId}');
      } else {
        // No hospital chosen → driver picks
        context.go('/driver/select-hospital/${widget.requestId}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.brandRed),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        backgroundColor: AppColors.lightBg,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: AppColors.onlineGreen.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person_add_rounded,
                      color: AppColors.onlineGreen, size: 60),
                ),
                const SizedBox(height: 32),
                const Text(
                  'Confirm Patient Pickup',
                  style: TextStyle(
                    color: AppColors.navy,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                const Text(
                  'Please confirm that you have picked up the patient and are ready to head to the hospital.',
                  style: TextStyle(
                      color: AppColors.textSecondary, fontSize: 15, height: 1.5),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _confirm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.onlineGreen,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      '✓ CONFIRM PICKUP',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
