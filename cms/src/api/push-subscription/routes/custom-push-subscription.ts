// Routes the Next.js app calls (app/api/push/subscribe and /unsubscribe).
export default {
  routes: [
    { method: 'POST', path: '/push-subscriptions/upsert', handler: 'push-subscription.upsert', config: {} },
    { method: 'POST', path: '/push-subscriptions/deactivate', handler: 'push-subscription.deactivate', config: {} },
  ],
};
