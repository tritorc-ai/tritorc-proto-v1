import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  // 1338, not Strapi's default 1337: the notifications Strapi (tritorc-strapi) uses 1337,
  // so both can run on one machine.
  port: env.int('PORT', 1338),
  // Production: PUBLIC_URL is the address people open (for example https://cms.tritorc.com) and
  // IS_PROXIED=true when a host or load balancer terminates HTTPS in front of Strapi.
  url: env('PUBLIC_URL', ''),
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
