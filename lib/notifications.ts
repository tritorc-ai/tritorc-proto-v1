import "server-only";

import { notifFetch } from "./strapiClient";
import { NOTIFICATIONS, type AppNotification, type NotificationTag } from "./mock/appContent";

interface StrapiNotification {
  documentId: string;
  title: string;
  body: string;
  url?: string | null;
  image?: string | null;
  type?: string | null;
  createdAt: string;
}

const TAG_BY_TYPE: Record<string, NotificationTag> = {
  manual: "Update",
  event: "Event",
  product: "Product",
  service: "Service",
  library: "Library",
  linkedin: "LinkedIn",
};

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

function map(n: StrapiNotification): AppNotification {
  return {
    id: n.documentId,
    tag: TAG_BY_TYPE[n.type ?? "manual"] ?? "Update",
    title: n.title,
    body: n.body,
    when: fmt.format(new Date(n.createdAt)),
    href: n.url || "/notifications",
    image: n.image || undefined,
    createdAt: n.createdAt,
  };
}

/** Live notifications from the notifications Strapi, newest first. null = backend unreachable. */
export async function getLiveNotifications(): Promise<AppNotification[] | null> {
  const res = await notifFetch<{ data: StrapiNotification[] }>("/api/notifications", {
    sort: "createdAt:desc",
    "pagination[pageSize]": "50",
  });
  return res ? res.data.map(map) : null;
}

/** Page feed: live items when there are any, otherwise the bundled mock content. */
export async function getNotificationFeed(): Promise<AppNotification[]> {
  const live = await getLiveNotifications();
  return live && live.length > 0 ? live : NOTIFICATIONS;
}
