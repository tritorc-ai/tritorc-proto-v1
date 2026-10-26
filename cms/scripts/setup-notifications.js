// One-time (re-runnable) setup for the notifications side of this Strapi.
//   1. Creates two API tokens limited to what the Next.js app needs:
//        tritorc-notif-read   -> read notifications
//        tritorc-notif-write  -> register / deactivate push subscriptions, create enquiries
//   2. Writes NOTIF_API_URL, NOTIF_API_READ_TOKEN and NOTIF_API_WRITE_TOKEN into the given
//      app .env.local (values are never printed). Re-running regenerates the tokens.
//
// Stop `npm run develop` first (SQLite has a single writer), then:
//   node scripts/setup-notifications.js "<app>\.env.local"
// Generate VAPID keys separately:  npx web-push generate-vapid-keys

const fs = require("fs");
const { createStrapi, compileStrapi } = require("@strapi/strapi");

const envOut = process.argv[2];

const TOKENS = [
  {
    name: "tritorc-notif-read",
    env: "NOTIF_API_READ_TOKEN",
    description: "Next.js app: read the notification inbox",
    permissions: ["api::notification.notification.find", "api::notification.notification.findOne"],
  },
  {
    name: "tritorc-notif-write",
    env: "NOTIF_API_WRITE_TOKEN",
    description: "Next.js app: register push subscriptions and create enquiries",
    permissions: [
      "api::push-subscription.push-subscription.upsert",
      "api::push-subscription.push-subscription.deactivate",
      "api::enquiry.enquiry.create",
    ],
  },
];

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = "error";
  const svc = app.service("admin::api-token");
  const keys = {};

  for (const t of TOKENS) {
    const existing = await svc.getByName(t.name);
    if (existing) await svc.revoke(existing.id);
    const created = await svc.create({
      name: t.name,
      description: t.description,
      type: "custom",
      permissions: t.permissions,
      lifespan: null,
    });
    keys[t.env] = created.accessKey;
  }

  if (envOut) {
    const base = fs.existsSync(envOut) ? fs.readFileSync(envOut, "utf8") : "";
    const drop = /^(NOTIF_API_URL|NOTIF_API_READ_TOKEN|NOTIF_API_WRITE_TOKEN)=/;
    const kept = base.split(/\r?\n/).filter((l) => l.trim() && !drop.test(l));
    const port = app.config.get("server.port");
    kept.push(`NOTIF_API_URL=http://localhost:${port}`);
    for (const [k, v] of Object.entries(keys)) kept.push(`${k}=${v}`);
    fs.writeFileSync(envOut, kept.join("\n") + "\n");
    console.log("wrote NOTIF_API_URL, NOTIF_API_READ_TOKEN, NOTIF_API_WRITE_TOKEN to", envOut, "(tokens not printed)");
  } else {
    console.log("created the two tokens (pass a .env.local path to save them)");
  }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("setup failed:", err);
  process.exit(1);
});
