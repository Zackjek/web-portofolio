# Muhammad Zaky Mubarok — Portfolio

Personal portfolio built with Next.js 16, React 19, Tailwind CSS 4, and Supabase.

## Features

- Responsive editorial-style portfolio with a smooth, grid-free ambient background
- English interface and compatibility localization for legacy Indonesian journal entries
- Persistent dark/light theme with system-preference detection and no theme flash
- Scroll progress, reveal-on-scroll sections, and an accessible back-to-top control
- Searchable and filterable project archive
- Dedicated certificate gallery with image and in-page PDF preview
- Batch certificate upload (drag-and-drop, multiple image/PDF files, editable titles)
- Journal publishing with rich HTML/table support
- Admin content control center with search, filters, edit, media replacement, preview, and confirmed deletion
- Password-based admin authentication backed by Supabase Auth
- In-app password recovery with a dedicated password update screen
- Automatic Supabase Storage cleanup when project or certificate media is replaced or deleted
- Dynamic content powered by Supabase
- Journal summaries cleaned from legacy Microsoft Word/VML styling artifacts
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
SERTIFIKAT, Issuer, 2026, Training
```

The admin batch uploader adds this marker automatically. Existing PDF entries
and entries with “sertifikat” in the title are also recognized by the gallery.

## Admin access and RLS

`/admin` uses Supabase email-and-password authentication and only accepts the
configured admin email. The password is verified and stored by Supabase Auth;
never add it to source code or a `NEXT_PUBLIC_*` environment variable. Ensure
the configured owner exists in Authentication > Users and has a password.

The **Send an email to create a password** action uses Supabase recovery and
returns to `/reset-password`, where the authenticated recovery session can call
`updateUser`. Add the following exact production URL to Authentication > URL
Configuration > Redirect URLs:

```text
https://muhammadzakymubarok-portofolio.vercel.app/reset-password
```

Recovery links that fall back to the production Site URL are also forwarded to
the reset screen before the page hydrates.

Apply
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
- `/reset-password` — authenticated password recovery screen
