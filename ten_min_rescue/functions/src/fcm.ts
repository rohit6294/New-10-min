import * as admin from "firebase-admin";

const messaging = admin.messaging();

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export interface AlertOptions {
  type: string;
  requestId: string;
  title: string;
  body: string;
  extra?: Record<string, string>;
}

/**
 * Send a high-priority *data-only* push to many devices.
 *
 * Data-only (no top-level `notification` block) means the Flutter app's
 * foreground AND background handlers are always invoked, so the app can
 * raise a full-screen, call-style emergency alert instead of a plain tray
 * notification. The `apns` block keeps delivery reliable on iOS.
 */
export async function sendAlert(
  tokens: Array<string | undefined | null>,
  opts: AlertOptions
): Promise<void> {
  const valid = tokens.filter((t): t is string => !!t);
  if (valid.length === 0) return;

  const data: Record<string, string> = {
    type: opts.type,
    requestId: opts.requestId,
    title: opts.title,
    body: opts.body,
    ...(opts.extra ?? {}),
  };

  const results = await Promise.all(
    chunk(valid, 500).map((batch) =>
      messaging.sendEachForMulticast({
        tokens: batch,
        data,
        android: { priority: "high" },
        apns: {
          headers: {
            "apns-priority": "10",
            "apns-push-type": "alert",
          },
          payload: {
            aps: {
              alert: { title: opts.title, body: opts.body },
              sound: "default",
              "content-available": 1,
            },
          },
        },
      })
    )
  );

  const failed = results.reduce((n, r) => n + r.failureCount, 0);
  if (failed > 0) {
    console.warn(
      `sendAlert(${opts.type}): ${failed}/${valid.length} token(s) failed`
    );
  }
}

/**
 * Send a lightweight silent data message — e.g. to dismiss the incoming
 * alert on drivers who did not win the request.
 */
export async function sendSilentData(
  tokens: Array<string | undefined | null>,
  data: Record<string, string>
): Promise<void> {
  const valid = tokens.filter((t): t is string => !!t);
  if (valid.length === 0) return;

  await Promise.all(
    chunk(valid, 500).map((batch) =>
      messaging.sendEachForMulticast({
        tokens: batch,
        data,
        android: { priority: "high" },
        apns: {
          headers: { "apns-priority": "5", "apns-push-type": "background" },
          payload: { aps: { "content-available": 1 } },
        },
      })
    )
  );
}
