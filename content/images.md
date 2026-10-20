# Photos from hallelujahchallengelive.com

21 unique images, downloaded at full original resolution (36 MB total) into
`public/assets/site/`. Filenames are the Wix media IDs, which is what the live
site's markup references — so you can map any page back to its source.

Every original is at `https://static.wixstatic.com/media/<filename>`; the live
site requests resized derivatives via a `/v1/fill/...` path on the same URL.

## The ministry's own imagery

| File | Size | What it is | Used on |
|---|---|---|---|
| `8120e4_25e2b8941d694229803c0f89dd3bb44c~mv2.png` | 5000×5500 | **"THE LORD REIGNS" theme artwork** (Oct 2026) | home |
| `e178bc_5b34df54b05948689b2ab65b55a55486~mv2.png` | 3000×2040 | Hallelujah Challenge logo | every page |
| `e178bc_7cbafe05c7df498da4c062e34bf25299~mv2.png` | 1080×446 | Hallelujah Challenge logo, wide lockup | every page |
| `e178bc_74952a632df64354bc7e4c52e9a97409f000.jpg` | 1920×1080 | Djembe under teal light — hero video poster | home |
| `e178bc_c8afc65f02014fd985ef729ac3fd673df000.jpg` | 3840×2160 | Festival stage, crowd and lights | home |
| `e178bc_d7e064dfa947410ba37c38e07e598a02~mv2.jpg` | 5840×3893 | Drum on a dark stage | about, testimonies |
| `e178bc_357b2c47f6934a28acac1f30c1680e31~mv2.jpg` | 7360×4912 | Crowd, black and white | testimonies |
| `e178bc_055d0eb7cb824141a2061fbdf61afdbff000.jpg` | 1920×1080 | Darkened auditorium crowd | home |
| `8120e4_268968f6ef5247e8a123896ef30ad457~mv2.jpeg` | 1920×1080 | Bright cloud burst | home |
| `8120e4_ab407cca53d5439fb8ebbd81347849ea~mv2.png` | 1920×1080 | Djembe drums on white | home (cropped as a partner tile) |
| `e178bc_ab062d2c857a4756bb610b2a8e7b4bf7~mv2.png` | 7872×3168 | Purple gradient band | testimonies |

## Logos, badges and third-party marks

| File | Size | What it is |
|---|---|---|
| `8120e4_e6f2a031e79e46eaa070348f0d4adfe4~mv2.png` | 2560×1440 | Partner logo board (SimmonsCooper, Showgear, Haggai, Konga, bank78 and others) |
| `e178bc_ab9099712d8143829033f6c8675d79a4~mv2.png` | 1268×662 | Nigerian government seal and a QR code |
| `e178bc_954cc9e88e4a4b58a3f34bc65fd0bbf8~mv2.png` | 646×250 | "Get it on Google Play" badge |
| `8120e4_ad65c59337e34eea9987568661953426~mv2.png` | 1280×379 | "Download on the App Store" badge |

> The partner logos and the two store badges belong to other organisations. The
> store badges in particular have their own brand guidelines — use Google's and
> Apple's official assets rather than these screenshots if you can.

## Wix stock library images

The `11062b_` prefix is Wix's shared media library, not the ministry's account.
These are generic stock, and you may not want to carry them into the rebuild.

| File | Size | What it is | Used on |
|---|---|---|---|
| `11062b_9fe8cf7ac275438cafa34f90833b0230~mv2.jpg` | 5000×1890 | Hands joined in prayer round a table | prayer points |
| `11062b_fce4349362194db9a95427b6d511ebaff000.jpg` | 1920×1080 | Clouds over water | prayer points |
| `11062b_e6d34c816aa7425bbe8c6be8f73e50b1~mv2.jpg` | 5847×3898 | White architectural fins | new converts |
| `11062b_407e13c69b8041af88725714590d991af000.jpg` | 1920×1080 | Blue ink dispersing in water | home |
| `e178bc_1d649000df2c42dd906808dc095b4f7e~mv2.png` | 1080×1080 | Hands folded on an open Bible | ask room |
| `e178bc_9436d8cd81b84e25b5ff8cf13f282bcb~mv2.png` | 1408×768 | Support agent at a desk | contact |

---

## What this means for the rebuild

**The theme artwork is now in place.** `public/assets/hc-theme-the-lord-reigns.png`
was regenerated from the 5000×5500 original: alpha-trimmed, then fitted without
distortion onto a 1308×1252 transparent canvas. That is exactly 2× the 654×626
box the design declares, so the ratio matches and nothing shifts, and it stays
crisp on retina.

**Five photos the rebuild uses are not reachable from any live page.** The
gallery and hero slides reference `DSC09945`, `DSC03162`, `DSC03192`, `DSC03171`
and `hc-feb-2026-day-1`. They sit on the same Wix CDN and load fine, but they
are not published on the current site — the designer sourced them separately.
Only `DSC00851` appears on both.
