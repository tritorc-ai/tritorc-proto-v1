# Tritorc App — Image Asset Brief (for the graphic designer)

Mobile-first PWA for Tritorc (industrial bolting, on-site machining, pipeline integrity). Sizes below are the **on-screen size on a 375px-wide phone**. Export at **3x** for sharpness (e.g. a 347×255 slot → 1041×765 px). Max content width is 448px, so nothing needs to be larger than 3x of that.

## 0. Global style guide
- **Look:** clean, premium, "Apple/Ather" — soft grey and black, lots of whitespace, rounded cards (22–32px radius). Real industrial photography, not clip-art.
- **Palette:** app background `#f3f3f2` · near-black `#171717` / `#0a0a0b` · card grey `#e4e5e7` · accent red `#d6312f` (use sparingly). Photos should be neutral/desaturated with natural steel, orange and blue tones; avoid heavy colour grading that clashes with the grey UI.
- **Typeface in the UI:** Plus Jakarta Sans (bold headlines). Any text baked into images should use it. **Prefer no text in images** — the app overlays its own titles.
- **Text-safe zones:** many cards have a dark gradient at the bottom (services/products) or a light gradient at the left (home). Keep the subject out of those areas (see per-asset notes).
- **Format:** WebP (quality ~80) or JPG, sRGB. PNG only where transparency is needed. Keep each file under ~250 KB (hero under ~400 KB). Use lowercase-kebab-case file names.
- **People/branding:** crew in Tritorc blue overalls/helmets with visible TRITORC logo is ideal. Product shots on a light studio backdrop (`#f7f8f9 → #d5d9dd`) with the product fully visible.
- **Rights:** only Tritorc-owned or licensed imagery.

## 1. Home screen (priority 1)
| Asset | Slot (px on phone) | Export (3x) | Notes |
|---|---|---|---|
| Hero slide 1 "Precision bolting, delivered." | card 347×255; image shows in the **right ~235px** | **1050×760** | Subject on the **right**; left 35% fades to light grey behind headline, so keep it calm/empty. Technician bolting a flange. |
| Hero slide 2 "Power for wind & energy." | same | 1050×760 | Wind turbine foundation/tower bolting. *Currently reuses slide 1's photo — needs its own.* |
| Hero slide 3 "Zero downtime. Bolting, delivered." | same | 1050×760 | Pipeline / hot-tapping / refinery. *Currently reuses slide 1's photo — needs its own.* |
| Bento tile: Flange Fastening | 168×280 (portrait) | **510×850** | Subject centre-right; left half fades to `#f7f6f4` behind text. |
| Bento tile: Products | 168×280 | 510×850 | A product hero (torque wrench / bolt tensioner) on the right; same fade on the left. |
| Testimonial background / stat cards | dark panel, cards 168×185 | optional | Currently plain dark; optional subtle dark photo texture. |
| Event cards (home deck + Events page) | text only today | optional | See §6. |

## 2. Services (priority 1)
Services list cards are **358×448 (≈4:5 portrait)**; export **1080×1350**. Bottom ~40% is covered by a dark gradient + title, so put the subject in the **upper 60%**. The detail-page hero is a **335 wide × ~420–500 tall** rounded card (use 1005×1400); one clean, well-lit hero per service.

Services shown in the app (one hero + one card crop each; 3–6 gallery photos for detail pages, mixed "product" and "in use"):
1. **Hot Tapping & Line Stopping** — *plays a 10s muted video (portrait 608×1080)*; still poster needed too.
2. **Retubing Services** — heat-exchanger tube bundle.
3. **Pipeline Coldcutting & Bevelling**
4. **Flange Facing**
5. **Dewatering & Dry Air Flushing**
6. **Hydro Testing**
7. **Nitrogen Helium Leak Testing**
8. **Nitrogen Purging & Preservation**
9. **Pneumatic Testing**
10. **Calibration Services**

Hidden from the list for now (still have detail pages, low priority): Onsite Controlled Bolting, Dry Rental, Pipe Freezing, Emergency Repair Clamp, Online Leak Sealing.

> The service photos now served from the old S3 bucket fail to load in some environments, so new self-hosted files are welcome: place at `/public/services/<slug>.webp`.

## 3. Products (priority 1)
Same card format as services (**1080×1350** portrait; subject upper 60%) plus detail hero (**1005×1400**). Product shots should be **whole product on the light studio backdrop** (shown "contained", never cropped). One hero + 3–4 gallery shots (product, in-use, detail/spec-plate macro) each.

Product categories (hero each): Torque Wrenches · Bolt Tensioners · Wind Turbine Foundation Tensioners · Heavy Impact Sockets · Pipe Cold Cutting & Beveling Machines · Flange Facing Machines · Tube & Pipe Beveling Machine · Tube Expanders · Tube Installation Tools · Tube Removal Tools · Tube Cleaning Tools · Single-Acting Cylinders · Double-Acting Cylinders · Cylinder Powerpacks & Pumps · Nut Splitters (heavy duty + light weight) · Flange Spreaders (low clearance + standard maxi kit) · Pipe Stands · Beam Roller · Chain Clamps.
Individual products with their own page: Square/Hex/Ultra-Slim Hex Drive Torque Wrench · Top-Side / Spring-Return / Multi-Stage Bolt Tensioner · Split Frame Pipe Cutting Machine · TWE-3 Electric Torquing Pump · TWP-3 Air Torque Pump · TBP-150 Air Tensioning Pump · TBE-200 Electric Tensioning Pump.

## 4. Company page
- **Overview slideshow**, full-bleed, shown ~375×420: 5 photos at **1125×1260** — tube bundle, on-site machining, offshore, Sharjah site, wellhead. Subject can sit anywhere (the app re-crops with a focal point); keep important content away from the outer 10%.
- **Case study images** (7 projects, shown ~335×200 → **1005×600**): Reliance Jamnagar, Adani Wind, Samsung Abu Dhabi O&G, Karabatan (Kazakhstan), ONGC NQP Offshore, ADNOC SARB, New Pamban Bridge.
- **Certification badges** (transparent PNG/SVG, ~64px tall → 192px): ISO, CE and any others.
- **Global offices:** flag icons exist; optional map pin icon (SVG, red `#d6312f`).

## 5. PWA / app identity (priority 1)
| Asset | Size | Notes |
|---|---|---|
| App icon (any) | **512×512** and **192×192** PNG | Tritorc mark on `#171717` or white; rounded square is applied by the OS — supply **square, full-bleed**. |
| Maskable icon | **512×512** PNG | Mark inside the **central 80% safe circle**; solid background to edge. |
| Apple touch icon | **180×180** PNG | No transparency; no rounded corners. |
| Favicon | 48×48 PNG + SVG | Simplified mark. |
| **Notification badge icon** | **96×96 PNG, white on transparent, flat/monochrome** | Shown in the Android status bar. Must be a single-colour silhouette (the "T" mark). |
| Notification large icon | 192×192 PNG | Same as app icon. |
| Splash / startup screen | **1290×2796** (and 1170×2532, 750×1334) | Black `#0a0a0b` with the wordmark centred; currently drawn in CSS with Chakra Petch — a designed version is welcome. |
| Logo wordmark | SVG (dark + white versions) | Currently a PNG at 104–133px wide; supply vector. |
| Social share image (OG) | **1200×630** | Wordmark + hero photo, for link previews. |

## 6. Notifications & events
- **Push notification image** (optional big picture on Android/Chrome): **1024×512** (2:1), no key content in the outer 10%.
- **Notification feed thumbnails / in-app banner image:** shown at 96×96 → supply **288×288** square crops.
- **Event hero images** (ADIPEC 2026, ADIPEC 2025, Windergy India 2025, OGA Malaysia 2025): detail header ~335×220 → **1005×660**; booth/stand photos preferred. Plus 3–4 gallery shots each.
- **Blog/case-study/article cards** use 288×288 thumbnails as above.

## 7. Library
Media grid thumbnails at **~160×160 → 480×480**: product brochure/catalogue covers (PDF first-page look), video posters (16:9 → **1280×720**), technical drawings (white background).

## 8. Video
- Hot tapping hero is the template: **portrait 9:16, 608×1080 (or 720×1280), 10s loop, no audio, H.264 MP4, under 1.5 MB**, plus a poster frame JPG. Same spec for any further service clips; ideally make the last frame blend into the first for a seamless loop.

## 9. Delivery checklist
1. One folder per section (home, services, products, company, brand, notifications, library).
2. File name = slug, e.g. `services/hot-tapping-line-stopping.webp`, `products/btl-9-bolt-tensioner.webp`.
3. Provide the @3x master (PSD/Figma/PNG) and the exported web file.
4. List which images are new vs. replacements, and the licence/source for any stock.

**Highest priority order:** PWA icons + notification badge → home hero ×3 + bento tiles ×2 → services hero/cards ×10 → product category heroes → company/case studies → events → library.
