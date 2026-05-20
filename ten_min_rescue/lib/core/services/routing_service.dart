import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

/// OSRM (Open Source Routing Machine) — free public routing API.
/// No API key, no credit card needed. Public demo server with rate limits.
///
/// Returns the actual road route between two points, plus driving distance and duration.
class RoutingService {
  // Public OSRM demo server. Free for moderate use.
  static const _baseUrl = 'https://router.project-osrm.org';

  /// Fetch the driving route between two points.
  /// Returns null on network error or no route found.
  ///
  /// [points] is the list of LatLng points along the road.
  /// [distanceKm] is the actual driving distance.
  /// [durationMinutes] is the OSRM-estimated duration.
  static Future<RouteResult?> getRoute(LatLng from, LatLng to) async {
    try {
      final url = '$_baseUrl/route/v1/driving/'
          '${from.longitude},${from.latitude};'
          '${to.longitude},${to.latitude}'
          '?overview=full&geometries=geojson';
      final res = await http
          .get(Uri.parse(url))
          .timeout(const Duration(seconds: 8));
      if (res.statusCode != 200) return null;
      final data = jsonDecode(res.body) as Map<String, dynamic>;
      final routes = data['routes'] as List?;
      if (routes == null || routes.isEmpty) return null;

      final route = routes.first as Map<String, dynamic>;
      final geometry = route['geometry'] as Map<String, dynamic>?;
      if (geometry == null) return null;
      final coords = geometry['coordinates'] as List;

      final points = coords
          .map((c) {
            final pair = c as List;
            return LatLng(
              (pair[1] as num).toDouble(),
              (pair[0] as num).toDouble(),
            );
          })
          .toList();

      final distanceMeters = (route['distance'] as num).toDouble();
      final durationSeconds = (route['duration'] as num).toDouble();

      return RouteResult(
        points: points,
        distanceKm: distanceMeters / 1000,
        durationMinutes: durationSeconds / 60,
      );
    } catch (_) {
      return null;
    }
  }
}

class RouteResult {
  final List<LatLng> points;
  final double distanceKm;
  final double durationMinutes;

  const RouteResult({
    required this.points,
    required this.distanceKm,
    required this.durationMinutes,
  });
}
