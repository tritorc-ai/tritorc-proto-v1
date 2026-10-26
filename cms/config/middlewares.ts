import type { Core } from '@strapi/strapi';

// The admin panel shows uploaded pictures from the S3 bucket / CDN, so that host must be allowed
// in the content security policy. Only added when S3_PUBLIC_URL is set.
const mediaHost = process.env.S3_PUBLIC_URL ? new URL(process.env.S3_PUBLIC_URL).origin : null;

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  mediaHost
    ? {
        name: 'strapi::security',
        config: {
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              'connect-src': ["'self'", 'https:'],
              'img-src': ["'self'", 'data:', 'blob:', mediaHost],
              'media-src': ["'self'", 'data:', 'blob:', mediaHost],
            },
          },
        },
      }
    : 'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
