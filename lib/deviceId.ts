const KEY = "tritorc:deviceId";

/** Anonymous per-device id (no login). Falls back to a throwaway id if storage is blocked. */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
