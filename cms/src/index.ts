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

const ENQUIRY_UID = 'api::enquiry.enquiry';
let alertBusy = false;

// New enquiries are emailed to ENQUIRY_ALERT_TO when SMTP is set up (SMTP_HOST in .env, see
// .env.example); otherwise they are only stored and nothing is sent. Polled for the same reasons
// as the push sender above: it runs outside the save's transaction and survives restarts.
async function sendEnquiryAlerts(strapi: Core.Strapi) {
  const to = process.env.ENQUIRY_ALERT_TO;
  if (!to || !process.env.SMTP_HOST || alertBusy) return;
  alertBusy = true;
  try {
    const pending = await strapi.db.query(ENQUIRY_UID).findMany({ where: { alertSentAt: null } });
    for (const e of pending) {
      const claimed = await strapi.db.query(ENQUIRY_UID).updateMany({
        where: { id: e.id, alertSentAt: null },
        data: { alertSentAt: new Date() },
      });
      if (!claimed?.count) continue;
      try {
        await strapi.plugin('email').service('email').send({
          to,
          replyTo: e.email,
          subject: `New Tritorc app enquiry: ${e.interest || 'General'} (${e.name})`,
          text: [
            `Name: ${e.name}`,
            `Email: ${e.email}`,
            `Phone: ${e.phone || '-'}`,
            `Company: ${e.company || '-'}`,
            `Interested in: ${e.interest || '-'}`,
            '',
            e.message,
          ].join('\n'),
        });
      } catch (err: any) {
        // Put it back so the next tick retries.
        await strapi.db.query(ENQUIRY_UID).update({ where: { id: e.id }, data: { alertSentAt: null } });
        strapi.log.error(`[enquiry] alert email failed: ${err?.message ?? err}`);
        break;
      }
    }
  } catch (err: any) {
    strapi.log.error(`[enquiry] alert check failed: ${err?.message ?? err}`);
  } finally {
    alertBusy = false;
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    timer = setInterval(() => {
      void sendPending(strapi);
      void sendEnquiryAlerts(strapi);
    }, POLL_MS);
    timer.unref();
  },

  destroy() {
    if (timer) clearInterval(timer);
  },
};
