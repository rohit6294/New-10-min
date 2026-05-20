enum AmbulanceType { A, B, C }

extension AmbulanceTypeX on AmbulanceType {
  String get value => name; // 'A', 'B', 'C'

  String get label {
    switch (this) {
      case AmbulanceType.A:
        return 'ICU Ambulance';
      case AmbulanceType.B:
        return 'Advanced Ambulance';
      case AmbulanceType.C:
        return 'Normal Ambulance';
    }
  }

  String get shortLabel {
    switch (this) {
      case AmbulanceType.A:
        return 'ICU';
      case AmbulanceType.B:
        return 'Advanced';
      case AmbulanceType.C:
        return 'Normal';
    }
  }

  String get description {
    switch (this) {
      case AmbulanceType.A:
        return 'Life support, ventilator, cardiac monitor';
      case AmbulanceType.B:
        return 'Oxygen, defibrillator, advanced monitoring';
      case AmbulanceType.C:
        return 'Basic transport and first aid';
    }
  }

  static AmbulanceType fromString(String? s) {
    switch (s) {
      case 'A':
        return AmbulanceType.A;
      case 'B':
        return AmbulanceType.B;
      default:
        return AmbulanceType.C;
    }
  }
}
