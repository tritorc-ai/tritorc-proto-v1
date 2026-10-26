import type { Core } from '@strapi/strapi';
import { dispatchPush } from './utils/push-dispatch';

const NOTIF_UID = 'api::notification.notification';
const POLL_MS = 5000;

let timer: NodeJS.Timeout | undefined;
let busy = false;

// Notifications saved with "Send Push" ticked and not yet sent go out to subscribed phones.
// Polled (rather than sent from a lifecycle hook) so the send runs outside the save's database
// transaction, and so a notification saved while Strapi was down still goes out on the next start.
async function sendPending(strapi: Core.Strapi) {
  if (busy) return;
  busy = true;
  try {
    const pending = await strapi.db.query(NOTIF_UID).findMany({ where: { sendPush: true, pushedAt: null } });
    for (const n of pending) {
      // Claim it first so a second tick can never send the same notification twice.
      const claimed = await strapi.db.query(NOTIF_UID).updateMany({
        where: { id: n.id, pushedAt: null },
        data: { pushedAt: new Date() },
      });
      if (claimed?.count) await dispatchPush(strapi, n);
    }
  } catch (err: any) {
    strapi.log.error(`[push] pending check failed: ${err?.message ?? err}`);
  } finally {
    busy = false;
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    timer = setInterval(() => void sendPending(strapi), POLL_MS);
    timer.unref();
  },

  destroy() {
    if (timer) clearInterval(timer);
  },
};
