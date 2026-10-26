import type { Core } from '@strapi/strapi';
import webpush from 'web-push';

const SUB_UID = 'api::push-subscription.push-subscription';
const NOTIF_UID = 'api::notification.notification';
const BATCH = 25;

let configured = false;

function configure(strapi: Core.Strapi): boolean {
  if (configured) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'https://www.tritorc.com';
  if (!pub || !priv) {
    strapi.log.warn('[push] VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set: push skipped');
    return false;
  }
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

interface Notification {
  id: number;
  documentId: string;
  title: string;
  body: string;
  url?: string | null;
  image?: string | null;
  type?: string | null;
  topic?: string | null;
}

/**
 * Sends one notification to every active subscription that follows its topic
 * ("general" reaches everyone). Subscriptions the push service reports gone
 * (404 / 410) are deleted. Never throws.
 */
export async function dispatchPush(strapi: Core.Strapi, n: Notification): Promise<void> {
  try {
    if (!configure(strapi)) return;

    const topic = n.topic || 'general';
    const all = await strapi.documents(SUB_UID).findMany({ filters: { active: true }, limit: 10000 });
    const targets = all.filter((s: any) => {
      const topics: string[] = Array.isArray(s.topics) ? s.topics : ['general'];
      return topic === 'general' || topics.includes(topic);
    });

    const payload = JSON.stringify({
      title: n.title,
      body: n.body,
      url: n.url || '/notifications',
      image: n.image || undefined,
      tag: n.documentId,
      id: n.documentId,
      type: n.type || 'manual',
    });

    let sent = 0;
    let removed = 0;
    for (let i = 0; i < targets.length; i += BATCH) {
      const batch = targets.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async (s: any) => {
          try {
            await webpush.sendNotification(
              { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
              payload,
              { TTL: 60 * 60 * 24 }
            );
            sent++;
          } catch (err: any) {
            if (err?.statusCode === 404 || err?.statusCode === 410) {
              removed++;
              await strapi.documents(SUB_UID).delete({ documentId: s.documentId });
            } else {
              await strapi.documents(SUB_UID).update({
                documentId: s.documentId,
                data: { lastError: String(err?.statusCode ?? err?.message ?? 'send failed').slice(0, 200) },
              });
            }
          }
        })
      );
    }

    await strapi.db.query(NOTIF_UID).update({
      where: { id: n.id },
      data: { pushSent: sent },
    });
    strapi.log.info(`[push] "${n.title}": ${sent} sent, ${removed} removed, ${targets.length} targeted`);
  } catch (err: any) {
    strapi.log.error(`[push] dispatch failed: ${err?.message ?? err}`);
  }
}
