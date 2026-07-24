# Muhammad Zaky Mubarok — Portfolio

Personal portfolio built with Next.js 16, React 19, Tailwind CSS 4, and Supabase.

## Features

- Responsive editorial-style portfolio with pointer-reactive lighting and subtle motion
- Searchable and filterable project archive
- Dedicated certificate gallery with image and in-page PDF preview
- Batch certificate upload (drag-and-drop, multiple image/PDF files, editable titles)
- Journal publishing with rich HTML/table support
- Admin content control center with search, filters, edit, media replacement, preview, and confirmed deletion
- Automatic Supabase Storage cleanup when project or certificate media is replaced or deleted
- Dynamic content powered by Supabase
- Accessible mobile navigation and reduced-motion support

## Local development

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=muhammadzakymubarok@student.telkomuniversity.ac.id
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

## Admin access and RLS

`/admin` uses a Supabase email magic link and only accepts the configured admin
email. Apply
`supabase/migrations/20260724150000_secure_admin_content.sql` once to the
Supabase project before using production write actions. The migration keeps
public reads available while restricting insert, update, delete, upload, and
storage cleanup to the owner email.

If the admin email changes, update both `NEXT_PUBLIC_ADMIN_EMAIL` and the email
inside the migration/policies.

## Routes

- `/` — home
- `/portofolio` — searchable project archive
- `/sertifikat` — certificate gallery
- `/jurnal` — learning journal
- `/admin` — full content management and publishing studio
