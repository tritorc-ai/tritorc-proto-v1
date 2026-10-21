Hey — before we hook up more content types, I want to sort out three things with you. Nothing urgent-urgent, but better to fix now than after content's already flowing.

**1. Draft vs Published — is it actually safe?**
When someone starts editing a Case Study (or anything else) in Strapi, can it accidentally show up on the live site before they hit "Publish"? I want to make sure our read API only ever pulls published entries, not drafts. Can you confirm Draft & Publish is turned on for these content types, and that the token we're using respects that?

**2. Videos — we need a real plan, not just "upload the file"**
Photos are fine to just drop into the Media Library. Videos are a different story — if we just upload raw video files to Strapi, it'll be slow to load, no proper streaming, and eats a ton of storage/bandwidth. Before anyone uploads a single video, let's decide where videos actually live — something like Cloudflare Stream, Mux, or even just unlisted YouTube links — and Strapi just stores the link/ID, not the file itself. Can you tell me what you'd recommend here?

**3. The "type it in a caption box" tagging trick is risky**
Right now catalogues show up on the site because someone types the word "catalogue" into a caption field, and our code looks for that word. It works, but it's one typo away from silently not showing up — and nobody would notice. That's an okay stopgap for catalogues, but for Case Studies especially, I'd rather have a proper content type in Strapi with real fields (title, client, summary, image, result, etc.) instead of relying on caption text. Can we build Case Studies as a real content type instead?

Let me know your thoughts on all three, especially #2 since that affects what people can start uploading right away.
