import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      // Production media: set S3_BUCKET (and the S3_* values in .env.example) and uploads go to
      // Amazon S3 or any S3-compatible store (e.g. Cloudflare R2 via S3_ENDPOINT) instead of the
      // server's disk, which is wiped when the server is rebuilt. Without S3_BUCKET, local disk.
      ...(env('S3_BUCKET')
        ? {
            provider: 'aws-s3',
            providerOptions: {
              // Public address of the bucket or its CDN; stored image links start with it.
              baseUrl: env('S3_PUBLIC_URL') || undefined,
              s3Options: {
                credentials: {
                  accessKeyId: env('S3_ACCESS_KEY_ID'),
                  secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
                },
                region: env('S3_REGION', 'us-east-1'),
                endpoint: env('S3_ENDPOINT') || undefined,
                forcePathStyle: env.bool('S3_FORCE_PATH_STYLE', false),
                // ACL key is always present on purpose: new S3 buckets and R2 reject ACL headers,
                // and the provider only skips its public-read default when the key exists.
                params: { Bucket: env('S3_BUCKET'), ACL: env('S3_ACL') || undefined },
              },
            },
            actionOptions: { upload: {}, uploadStream: {}, delete: {} },
          }
        : {}),
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
  // Enquiry alert emails: set SMTP_HOST (and the SMTP_* values in .env.example). Without it no
  // email is sent and enquiries are only stored in Strapi.
  ...(env('SMTP_HOST')
    ? {
        email: {
          config: {
            provider: 'nodemailer',
            providerOptions: {
              host: env('SMTP_HOST'),
              port: env.int('SMTP_PORT', 587),
              secure: env.bool('SMTP_SECURE', false),
              auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
            },
            settings: {
              defaultFrom: env('SMTP_FROM', env('SMTP_USER')),
              defaultReplyTo: env('SMTP_FROM', env('SMTP_USER')),
            },
          },
        },
      }
    : {}),
});

export default config;
