import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/services/firestore_service.dart';
import '../../../core/models/rescue_request_model.dart';
import '../../../core/models/ambulance_type.dart';
import '../../../core/constants/app_colors.dart';

/// Incoming ambulance NOTIFICATION (no accept/decline).
/// The hospital was already auto-assigned. They just prepare the bed.
class IncomingAmbulanceScreen extends StatefulWidget {
  final String requestId;
  const IncomingAmbulanceScreen({super.key, required this.requestId});

  @override
  State<IncomingAmbulanceScreen> createState() =>
      _IncomingAmbulanceScreenState();
}

class _IncomingAmbulanceScreenState extends State<IncomingAmbulanceScreen>
    with SingleTickerProviderStateMixin {
  final _firestoreService = FirestoreService();
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<RescueRequestModel>(
      stream: _firestoreService.watchRequest(widget.requestId),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(
                child: CircularProgressIndicator(color: AppColors.brandRed)),
          );
        }
        final request = snapshot.data!;
        final urgencyColor =
            AppColors.urgencyColor(request.urgencyLevel.value);
        final gradient =
            AppColors.urgencyGradient(request.urgencyLevel.value);

        return Scaffold(
          body: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: gradient,
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    const SizedBox(height: 16),
                    // Banner
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'AMBULANCE INCOMING',
                        style: GoogleFonts.poppins(
                          color: urgencyColor,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2,
                        ),
                      ),
                    ),
                    const Spacer(),
                    // Animated icon
                    AnimatedBuilder(
                      animation: _pulseController,
                      builder: (_, __) => Transform.scale(
                        scale: 1.0 + _pulseController.value * 0.12,
                        child: Container(
                          width: 130,
                          height: 130,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.directions_car_rounded,
                              color: Colors.white, size: 70),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Patient en route',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Type ${request.ambulanceType.value} · ${request.ambulanceType.shortLabel}',
                      style: GoogleFonts.poppins(
                        color: Colors.white70,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const Spacer(),
                    // Patient info
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: Colors.white.withValues(alpha: 0.2)),
                      ),
                      child: Column(
                        children: [
                          _infoRow(Icons.person_outline, 'Patient',
                              request.patientName),
                          _divider(),
                          _infoRow(Icons.phone_outlined, 'Phone',
                              request.patientPhone),
                          _divider(),
                          _infoRow(
                            Icons.warning_rounded,
                            'Urgency',
                            request.urgencyLevel.label,
                          ),
                          if (request.emergencyDescription.isNotEmpty) ...[
                            _divider(),
                            _infoRow(
                              Icons.info_outline,
                              'Details',
                              request.emergencyDescription,
                              maxLines: 3,
                            ),
                          ],
                          _divider(),
                          _infoRow(
                            Icons.person_pin_circle_outlined,
                            'Selected by',
                            request.hospitalChosenBy == 'patient'
                                ? 'Patient (via SOS)'
                                : 'Driver',
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Action buttons
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline,
                              color: Colors.white70, size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Prepare the bed and monitor patient progress.',
                              style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 12,
                                  height: 1.4),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => context
                            .go('/hospital/track/${widget.requestId}'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: urgencyColor,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        icon: const Icon(Icons.navigation_rounded),
                        label: Text(
                          'TRACK AMBULANCE LIVE',
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _infoRow(IconData icon, String label, String value,
      {int maxLines = 1}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: Colors.white70, size: 16),
        const SizedBox(width: 10),
        SizedBox(
          width: 70,
          child: Text(
            label,
            style: GoogleFonts.poppins(
                color: Colors.white70, fontSize: 12),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: GoogleFonts.poppins(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
            maxLines: maxLines,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.right,
          ),
        ),
      ],
    );
  }

  Widget _divider() => Container(
        height: 1,
        margin: const EdgeInsets.symmetric(vertical: 10),
        color: Colors.white.withValues(alpha: 0.15),
      );
}
