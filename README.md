# Muhammad Zaky Mubarok — Portfolio

Personal portfolio built with Next.js 16, React 19, Tailwind CSS 4, and Supabase.

## Features

- Responsive editorial-style portfolio with pointer-reactive lighting and subtle motion
- Searchable and filterable project archive
- Dedicated certificate gallery with image and in-page PDF preview
- Batch certificate upload (drag-and-drop, multiple image/PDF files, editable titles)
- Journal publishing with rich HTML/table support
- Dynamic content powered by Supabase
- Accessible mobile navigation and reduced-motion support

## Local development

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then run:

```bash
npm install
npm run dev
```

## Supabase content model

The redesign intentionally keeps the existing `portofolio`, `jurnal`, and
`gambar-portofolio` storage setup, so it deploys without a database migration.

Certificates are stored in the existing `portofolio` table with `SERTIFIKAT`
as the first comma-separated value in the `teknologi` column:

```text
SERTIFIKAT, Issuer, 2026, Pelatihan
```

The admin batch uploader adds this marker automatically. Existing PDF entries
and entries with “sertifikat” in the title are also recognized by the gallery.

## Routes

- `/` — home
- `/portofolio` — searchable project archive
- `/sertifikat` — certificate gallery
- `/jurnal` — learning journal
- `/admin` — content publishing studio
