import UIKit
import Flutter
import Firebase
import FirebaseMessaging
import UserNotifications

@main
@objc class AppDelegate: FlutterAppDelegate, MessagingDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    FirebaseApp.configure()

    // FCM
    Messaging.messaging().delegate = self
    UNUserNotificationCenter.current().delegate = self

    // Request the loud, full-screen-style alert authorisation up front.
    // (User can still revoke from Settings; Flutter side reads the result.)
    let authOptions: UNAuthorizationOptions = [.alert, .sound, .badge, .criticalAlert]
    UNUserNotificationCenter.current().requestAuthorization(
      options: authOptions,
      completionHandler: { _, _ in }
    )

    application.registerForRemoteNotifications()

    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // APNs → FCM token bridge.
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }

  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    // Flutter side picks the token up via FirebaseMessaging.instance.getToken().
    // Logged here so CI build logs make it obvious if FCM never initialises.
    NSLog("FCM token refreshed: \(fcmToken ?? "<nil>")")
  }
}
