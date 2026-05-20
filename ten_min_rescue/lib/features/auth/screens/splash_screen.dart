import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/app_colors.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulse;

  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _navigate();
  }

  Future<void> _navigate() async {
    await Future.delayed(const Duration(milliseconds: 1800));
    if (!mounted) return;

    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      context.go('/auth/login');
      return;
    }

    try {
      // 1. Check drivers collection first
      final driverDoc = await FirebaseFirestore.instance
          .collection('drivers')
          .doc(user.uid)
          .get();

      if (driverDoc.exists) {
        final data = (driverDoc.data() as Map<String, dynamic>?) ?? {};
        final verificationStatus =
            data['verificationStatus'] as String? ?? 'pending';
        final documents =
            (data['documents'] as Map<String, dynamic>?) ?? {};

        if (!mounted) return;
        if (verificationStatus == 'verified') {
          context.go('/driver/home');
        } else if (verificationStatus == 'pending' ||
            verificationStatus == 'rejected') {
          if (documents.isEmpty) {
            context.go('/driver/upload-docs');
          } else {
            context.go('/driver/home');
          }
        } else {
          context.go('/driver/home');
        }
        return;
      }

      // 2. Check hospitals collection
      final hospDoc = await FirebaseFirestore.instance
          .collection('hospitals')
          .doc(user.uid)
          .get();

      if (hospDoc.exists) {
        if (!mounted) return;
        context.go('/hospital/home');
        return;
      }

      // 3. Neither — back to login
      if (!mounted) return;
      context.go('/auth/login');
    } catch (_) {
      if (!mounted) return;
      context.go('/auth/login');
    }
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.navy,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Emergency icon
            AnimatedBuilder(
              animation: _pulse,
              builder: (_, __) => Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: AppColors.brandRed,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.brandRed
                          .withValues(alpha: 0.4 + _pulse.value * 0.3),
                      blurRadius: 30,
                      spreadRadius: 4 + _pulse.value * 6,
                    ),
                  ],
                ),
                child: const Icon(Icons.emergency, color: Colors.white, size: 56),
              ),
            ),
            const SizedBox(height: 28),
            Text(
              '10Min',
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 36,
                fontWeight: FontWeight.w900,
                letterSpacing: -1,
              ),
            ),
            Text(
              'Rescue',
              style: GoogleFonts.poppins(
                color: AppColors.brandRed,
                fontSize: 36,
                fontWeight: FontWeight.w900,
                letterSpacing: -1,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Emergency Ambulance Platform',
              style: GoogleFonts.poppins(
                color: Colors.white54,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 64),
            const SizedBox(
              width: 32,
              height: 32,
              child: CircularProgressIndicator(
                color: AppColors.brandRed,
                strokeWidth: 2.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
