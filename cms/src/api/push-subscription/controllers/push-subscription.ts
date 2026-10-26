import { factories } from '@strapi/strapi';

const UID = 'api::push-subscription.push-subscription';

export default factories.createCoreController(UID, ({ strapi }) => ({
  // POST /api/push-subscriptions/upsert: one row per endpoint; re-subscribing re-activates it.
  async upsert(ctx) {
    const d = ctx.request.body?.data ?? {};
    if (typeof d.endpoint !== 'string' || typeof d.p256dh !== 'string' || typeof d.auth !== 'string') {
      return ctx.badRequest('endpoint, p256dh and auth are required');
    }
    const data = {
      endpoint: d.endpoint,
      p256dh: d.p256dh,
      auth: d.auth,
      deviceId: typeof d.deviceId === 'string' ? d.deviceId.slice(0, 64) : undefined,
      topics: Array.isArray(d.topics) && d.topics.length ? d.topics : ['general'],
      userAgent: typeof d.userAgent === 'string' ? d.userAgent.slice(0, 255) : undefined,
      active: true,
      lastError: '',
    };
    const existing = await strapi.documents(UID).findFirst({ filters: { endpoint: data.endpoint } });
    const doc = existing
      ? await strapi.documents(UID).update({ documentId: existing.documentId, data })
      : await strapi.documents(UID).create({ data });
    ctx.body = { data: { documentId: doc?.documentId ?? existing?.documentId } };
  },

  // POST /api/push-subscriptions/deactivate: the user turned notifications off.
  async deactivate(ctx) {
    const endpoint = ctx.request.body?.data?.endpoint;
    if (typeof endpoint !== 'string') return ctx.badRequest('endpoint is required');
    const existing = await strapi.documents(UID).findFirst({ filters: { endpoint } });
    if (existing) {
      await strapi.documents(UID).update({ documentId: existing.documentId, data: { active: false } });
    }
    ctx.body = { data: { ok: true } };
  },
}));
