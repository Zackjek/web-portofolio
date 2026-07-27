"use client";

import { useEffect, useRef, useState } from "react";
import AdminContentManager from "@/components/AdminContentManager";
import { CERTIFICATE_MARKER } from "@/lib/content";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { removeMedia, uploadMedia } from "@/lib/storage";

type Tab = "kelola" | "jurnal" | "portofolio" | "sertifikat";
type AccessState = "checking" | "guest" | "authorized" | "denied";
type AuthMessageTone = "neutral" | "error";
type QueuedCertificate = {
  id: string;
  file: File;
  title: string;
};

const ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
  "muhammadzakymubarok@student.telkomuniversity.ac.id"
).toLowerCase();

const fieldClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#080d11] px-4 py-3 text-sm text-white placeholder:text-zinc-700 transition focus:border-lime-300/50 focus:outline-none";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An unknown error occurred.";
}

function titleFromFile(name: string) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function loginErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("email not confirmed")
  ) {
    return "The admin email or password is incorrect.";
  }

  if (
    normalizedMessage.includes("too many requests") ||
    normalizedMessage.includes("rate limit")
  ) {
    return "Too many sign-in attempts. Please wait a moment and try again.";
  }

  return "Sign-in failed. Check your connection and try again.";
}

export default function AdminPage() {
  const [access, setAccess] = useState<AccessState>("checking");
  const [activeEmail, setActiveEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [sendingRecovery, setSendingRecovery] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authMessageTone, setAuthMessageTone] =
    useState<AuthMessageTone>("neutral");

  useEffect(() => {
    let active = true;

    const applySession = (email: string | null | undefined) => {
      if (!active) return;
      const normalizedEmail = email?.toLowerCase() ?? "";
      setActiveEmail(normalizedEmail);
      setAccess(
        !normalizedEmail
          ? "guest"
          : normalizedEmail === ADMIN_EMAIL
            ? "authorized"
            : "denied",
      );
    };

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        applySession(data.session?.user.email);
      })
      .catch(() => {
        if (!active) return;
        setAccess("guest");
        setAuthMessage("The session could not be verified. Please sign in again.");
        setAuthMessageTone("error");
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user.email);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setAuthMessage("Supabase is not configured for this deployment.");
      setAuthMessageTone("error");
      return;
    }

    if (!password) {
      setAuthMessage("Enter the admin password.");
      setAuthMessageTone("error");
      return;
    }

    setSigningIn(true);
    setAuthMessage("");
    setAuthMessageTone("neutral");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });

      if (error) {
        setAuthMessage(loginErrorMessage(error.message));
        setAuthMessageTone("error");
        return;
      }

      const normalizedEmail = data.user.email?.toLowerCase() ?? "";
      if (normalizedEmail !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        setActiveEmail(normalizedEmail);
        setAccess("denied");
        setAuthMessage("This account does not have admin access.");
        setAuthMessageTone("error");
        return;
      }

      setPassword("");
      setActiveEmail(normalizedEmail);
      setAccess("authorized");
    } catch {
      setAuthMessage("Sign-in failed. Check your connection and try again.");
      setAuthMessageTone("error");
    } finally {
      setSigningIn(false);
    }
  };

  const sendPasswordRecovery = async () => {
    if (!isSupabaseConfigured) {
      setAuthMessage("Supabase is not configured for this deployment.");
      setAuthMessageTone("error");
      return;
    }

    setSendingRecovery(true);
    setAuthMessage("");
    setAuthMessageTone("neutral");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        const isRateLimited =
          error.message.toLowerCase().includes("rate limit") ||
          error.message.toLowerCase().includes("too many requests");
        setAuthMessage(
          isRateLimited
            ? "Supabase has temporarily rate-limited recovery emails. Wait about one hour, then press this button once."
            : "The recovery email could not be sent. Check your connection and try again.",
        );
        setAuthMessageTone("error");
        return;
      }

      setRecoverySent(true);
      setAuthMessage(
        "The recovery email has been sent. Open the newest message and use its link once.",
      );
      setAuthMessageTone("neutral");
    } catch {
      setAuthMessage("The recovery email could not be sent. Please try again later.");
      setAuthMessageTone("error");
    } finally {
      setSendingRecovery(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAccess("guest");
    setActiveEmail("");
    setPassword("");
    setAuthMessage("You have signed out of Admin Studio.");
    setAuthMessageTone("neutral");
  };

  if (access === "checking") {
    return (
      <section className="section-pad page-shell grid min-h-[80vh] place-items-center pt-32">
        <div className="text-center">
          <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" />
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
            Checking admin session
          </p>
        </div>
      </section>
    );
  }

  if (access !== "authorized") {
    return (
      <section className="section-pad page-shell grid min-h-[88vh] place-items-center pt-32">
        <div className="glass-card w-full max-w-lg rounded-[1.7rem] p-6 md:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-lime-300/15 bg-lime-300/[0.05] text-lime-300">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">
            Protected workspace
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
            Sign in to Admin Studio
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Publishing, editing, and deletion are restricted to the portfolio
            owner&apos;s email. Sign in directly with the admin password—no
            email or magic link required.
          </p>

          {access === "denied" && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4 text-sm leading-6 text-red-200">
              The account <span className="font-bold">{activeEmail}</span> does
              not have admin access.
            </div>
          )}

          {authMessage && (
            <div
              role={authMessageTone === "error" ? "alert" : "status"}
              className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${
                authMessageTone === "error"
                  ? "border-red-400/20 bg-red-400/[0.05] text-red-200"
                  : "border-white/[0.08] bg-white/[0.025] text-zinc-400"
              }`}
            >
              {authMessage}
            </div>
          )}

          {access === "denied" ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-7 w-full rounded-xl border border-white/10 px-5 py-3.5 text-sm font-bold text-zinc-400 transition hover:text-white"
            >
              Sign out of this account
            </button>
          ) : (
            <form onSubmit={signIn} className="mt-7 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">
                  Admin email
                </span>
                <input
                  type="email"
                  name="email"
                  value={ADMIN_EMAIL}
                  readOnly
                  autoComplete="username"
                  className={`${fieldClass} cursor-not-allowed opacity-70`}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">
                  Password
                </span>
                <span className="relative block">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    minLength={6}
                    required
                    autoFocus
                    className={`${fieldClass} pr-24`}
                    placeholder="Enter the admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 my-auto h-fit rounded-lg px-2 py-1 text-[10px] font-bold text-zinc-600 transition hover:text-lime-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={signingIn || !isSupabaseConfigured || !password}
                className="flex w-full items-center justify-between rounded-xl bg-lime-300 px-5 py-4 text-sm font-black text-[#202127] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>{signingIn ? "Verifying..." : "Sign in to Admin"}</span>
                <span>↗</span>
              </button>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="text-xs leading-5 text-zinc-500">
                  Haven&apos;t created a password yet, or forgot it?
                </p>
                <button
                  type="button"
                  onClick={() => void sendPasswordRecovery()}
                  disabled={
                    sendingRecovery ||
                    recoverySent ||
                    !isSupabaseConfigured
                  }
                  className="mt-2 text-left text-xs font-bold text-lime-300 transition hover:text-lime-200 disabled:cursor-not-allowed disabled:text-zinc-600"
                >
                  {sendingRecovery
                    ? "Sending recovery email..."
                    : recoverySent
                      ? "Recovery email sent"
                      : "Send an email to create a password →"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-zinc-700">
            Password securely verified by Supabase Auth
          </p>
        </div>
      </section>
    );
  }

  return (
    <AdminPanel
      userEmail={activeEmail}
      onSignOut={() => void signOut()}
    />
  );
}

function AdminPanel({
  userEmail,
  onSignOut,
}: {
  userEmail: string;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<Tab>("kelola");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [contentVersion, setContentVersion] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  const [journalTitle, setJournalTitle] = useState("");

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectFile, setProjectFile] = useState<File | null>(null);

  const [issuer, setIssuer] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [category, setCategory] = useState("Training");
  const [certificateDescription, setCertificateDescription] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [certificateFiles, setCertificateFiles] = useState<QueuedCertificate[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectTab = (value: Tab) => {
    setTab(value);
    setMessage("");
  };

  const handleUploadJournal = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = editorRef.current?.innerHTML.trim() ?? "";
    if (!journalTitle.trim() || !content) {
      setMessage("A title and journal content are required.");
      return;
    }

    setLoading(true);
    setMessage("Publishing journal entry...");
    try {
      const { error } = await supabase.from("jurnal").insert([
        { judul: journalTitle.trim(), konten: content },
      ]);
      if (error) throw error;

      setJournalTitle("");
      if (editorRef.current) editorRef.current.innerHTML = "";
      setContentVersion((current) => current + 1);
      setMessage("Journal entry published successfully.");
    } catch (error) {
      setMessage(`Failed to publish the journal entry: ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectTitle.trim() || !projectDescription.trim() || !projectFile) {
      setMessage("A title, description, and project cover are required.");
      return;
    }

    setLoading(true);
    setMessage("Uploading project...");
    let uploadedUrl: string | null = null;
    try {
      const { publicUrl: imageUrl } = await uploadMedia(projectFile, "projects");
      uploadedUrl = imageUrl;
      const { error } = await supabase.from("portofolio").insert([
        {
          judul: projectTitle.trim(),
          deskripsi: projectDescription.trim(),
          teknologi: projectTech.trim(),
          link_proyek: projectLink.trim() || null,
          gambar_url: imageUrl,
        },
      ]);
      if (error) throw error;
      uploadedUrl = null;

      setProjectTitle("");
      setProjectDescription("");
      setProjectTech("");
      setProjectLink("");
      setProjectFile(null);
      setContentVersion((current) => current + 1);
      setMessage("Project added to the gallery successfully.");
    } catch (error) {
      if (uploadedUrl) await removeMedia(uploadedUrl);
      setMessage(`Failed to upload the project: ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const addCertificateFiles = (files: FileList | File[]) => {
    const allowed = Array.from(files).filter((file) => {
      const validType = file.type.startsWith("image/") || file.type === "application/pdf";
      const validSize = file.size <= 20 * 1024 * 1024;
      return validType && validSize;
    });

    if (allowed.length !== Array.from(files).length) {
      setMessage("Some files were skipped. Use images or PDFs up to 20 MB each.");
    } else {
      setMessage("");
    }

    setCertificateFiles((current) => [
      ...current,
      ...allowed.map((file) => ({
        id: crypto.randomUUID(),
        file,
        title: titleFromFile(file.name),
      })),
    ]);
  };

  const handleUploadCertificates = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!issuer.trim() || !year.trim() || certificateFiles.length === 0) {
      setMessage("An issuer, year, and at least one credential file are required.");
      return;
    }

    if (certificateFiles.some((item) => !item.title.trim())) {
      setMessage("Every credential must have a title.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setMessage(`Preparing ${certificateFiles.length} credentials...`);

    try {
      for (let index = 0; index < certificateFiles.length; index += 1) {
        const item = certificateFiles[index];
        setMessage(`Uploading ${index + 1} of ${certificateFiles.length}: ${item.title}`);
        const { publicUrl: fileUrl } = await uploadMedia(item.file, "certificates");
        const tags = [
          CERTIFICATE_MARKER,
          issuer.trim(),
          year.trim(),
          category.trim(),
        ].filter(Boolean).join(", ");

        const { error } = await supabase.from("portofolio").insert([
          {
            judul: item.title.trim(),
            deskripsi:
              certificateDescription.trim() ||
              `${item.title.trim()}, issued by ${issuer.trim()}.`,
            teknologi: tags,
            link_proyek: verificationUrl.trim() || null,
            gambar_url: fileUrl,
          },
        ]);
        if (error) {
          await removeMedia(fileUrl);
          throw error;
        }
        setUploadProgress(Math.round(((index + 1) / certificateFiles.length) * 100));
      }

      const total = certificateFiles.length;
      setCertificateFiles([]);
      setCertificateDescription("");
      setVerificationUrl("");
      setUploadProgress(100);
      setContentVersion((current) => current + 1);
      setMessage(`${total} credentials published successfully.`);
    } catch (error) {
      setMessage(`The process stopped: ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad page-shell pt-32 md:pt-40">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside>
          <p className="eyebrow">Content studio</p>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">Admin studio.</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Manage, edit, delete, and publish all portfolio content.
          </p>

          <div className="mt-8 space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-2">
            {([
              ["kelola", "Manage content", "Edit, preview & delete"],
              ["sertifikat", "Credentials", "Upload multiple files"],
              ["portofolio", "Work", "Projects & case studies"],
              ["jurnal", "Journal", "Weekly notes"],
            ] as const).map(([value, label, caption], index) => (
              <button
                key={value}
                type="button"
                onClick={() => selectTab(value)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                  tab === value ? "bg-lime-300 text-[#202127]" : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className={`grid h-8 w-8 place-items-center rounded-full font-mono text-[9px] ${tab === value ? "bg-black/10" : "border border-white/10"}`}>
                  0{index + 1}
                </span>
                <span>
                  <span className="block text-sm font-black">{label}</span>
                  <span className={`block text-[10px] ${tab === value ? "text-black/50" : "text-zinc-700"}`}>{caption}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={`mt-4 rounded-xl border p-4 ${isSupabaseConfigured ? "border-lime-300/15 bg-lime-300/[0.04]" : "border-amber-300/15 bg-amber-300/[0.04]"}`}>
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
              <span className={`h-1.5 w-1.5 rounded-full ${isSupabaseConfigured ? "bg-lime-300 pulse-dot" : "bg-amber-300"}`} />
              {isSupabaseConfigured ? "Database connected" : "Environment required"}
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-zinc-700">
              Signed in as
            </p>
            <p className="mt-2 truncate text-xs font-bold text-zinc-400">
              {userEmail}
            </p>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-3 text-xs font-bold text-zinc-600 transition hover:text-red-300"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="glass-card rounded-[1.7rem] p-5 md:p-8">
          {tab === "kelola" && (
            <AdminContentManager refreshKey={contentVersion} />
          )}

          {tab === "sertifikat" && (
            <form onSubmit={handleUploadCertificates} className="space-y-7">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">Batch uploader</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Publish credentials</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Select multiple images or PDFs at once. Each title can still
                  be edited before upload.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400">Issuer / Institution *</span>
                  <input value={issuer} onChange={(event) => setIssuer(event.target.value)} className={fieldClass} placeholder="Example: Google Career Certificates" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400">Year *</span>
                    <input value={year} onChange={(event) => setYear(event.target.value)} inputMode="numeric" className={fieldClass} placeholder="2026" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400">Category</span>
                    <select value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass}>
                      <option>Training</option>
                      <option>Competition</option>
                      <option>Conference</option>
                      <option>Organization</option>
                      <option>Academic</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
              </div>

              <label
                className="group grid min-h-48 cursor-pointer place-items-center rounded-2xl border border-dashed border-white/15 bg-[#080d11] p-6 text-center transition hover:border-lime-300/45 hover:bg-lime-300/[0.025]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  addCertificateFiles(event.dataTransfer.files);
                }}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    if (event.target.files) addCertificateFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
                <span>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-2xl text-zinc-500 transition group-hover:border-lime-300/30 group-hover:text-lime-300">
                    +
                  </span>
                  <span className="mt-4 block text-sm font-black text-white">Drop files here or click to browse</span>
                  <span className="mt-2 block font-mono text-[9px] uppercase tracking-wider text-zinc-700">PNG, JPG, WEBP, PDF • max. 20 MB/file</span>
                </span>
              </label>

              {certificateFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-400">{certificateFiles.length} files ready</p>
                    <button type="button" onClick={() => setCertificateFiles([])} className="text-xs text-zinc-600 transition hover:text-red-300">
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                    {certificateFiles.map((item, index) => (
                      <div key={item.id} className="grid gap-3 rounded-xl border border-white/[0.08] bg-[#080d11] p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] font-mono text-[9px] text-lime-300">
                          {item.file.type === "application/pdf" ? "PDF" : "IMG"}
                        </span>
                        <div className="min-w-0">
                          <input
                            value={item.title}
                            onChange={(event) =>
                              setCertificateFiles((current) =>
                                current.map((queued) =>
                                  queued.id === item.id ? { ...queued, title: event.target.value } : queued,
                                ),
                              )
                            }
                            className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                            aria-label={`Credential title ${index + 1}`}
                          />
                          <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-wider text-zinc-700">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB • {item.file.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCertificateFiles((current) => current.filter((queued) => queued.id !== item.id))}
                          className="grid h-8 w-8 place-items-center rounded-full text-zinc-600 transition hover:bg-red-400/10 hover:text-red-300"
                          aria-label={`Remove ${item.title}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="space-y-2">
                <span className="text-xs font-bold text-zinc-400">Shared description <span className="font-normal text-zinc-700">(optional)</span></span>
                <textarea value={certificateDescription} onChange={(event) => setCertificateDescription(event.target.value)} className={`${fieldClass} min-h-24 resize-y`} placeholder="The skills or achievement demonstrated by these credentials..." />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold text-zinc-400">Verification link <span className="font-normal text-zinc-700">(optional)</span></span>
                <input type="url" value={verificationUrl} onChange={(event) => setVerificationUrl(event.target.value)} className={fieldClass} placeholder="https://..." />
              </label>

              {loading && tab === "sertifikat" && (
                <div className="overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-1.5 rounded-full bg-lime-300 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}

              <button type="submit" disabled={loading || certificateFiles.length === 0} className="flex w-full items-center justify-between rounded-xl bg-lime-300 px-5 py-4 text-sm font-black text-[#202127] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40">
                <span>{loading ? "Processing..." : `Publish ${certificateFiles.length || ""} credentials`}</span>
                <span>↗</span>
              </button>
            </form>
          )}

          {tab === "portofolio" && (
            <form onSubmit={handleUploadProject} className="space-y-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">Project entry</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Add new work</h2>
              </div>
              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">Project title *</span>
                <input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} className={fieldClass} placeholder="A clear, compelling project name" />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">Description *</span>
                <textarea value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} className={`${fieldClass} min-h-32 resize-y`} placeholder="The problem, solution, and project impact..." />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400">Technologies</span>
                  <input value={projectTech} onChange={(event) => setProjectTech(event.target.value)} className={fieldClass} placeholder="Next.js, Supabase, Go" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400">Project link</span>
                  <input type="url" value={projectLink} onChange={(event) => setProjectLink(event.target.value)} className={fieldClass} placeholder="https://..." />
                </label>
              </div>
              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">Project cover *</span>
                <input type="file" accept="image/*" onChange={(event) => setProjectFile(event.target.files?.[0] ?? null)} className="block w-full rounded-xl border border-white/[0.09] bg-[#080d11] p-3 text-xs text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white" />
              </label>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-between rounded-xl bg-lime-300 px-5 py-4 text-sm font-black text-[#202127] transition hover:bg-lime-200 disabled:opacity-40">
                <span>{loading ? "Uploading..." : "Publish project"}</span><span>↗</span>
              </button>
            </form>
          )}

          {tab === "jurnal" && (
            <form onSubmit={handleUploadJournal} className="space-y-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">Writing desk</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Write a new journal entry</h2>
              </div>
              <label className="block space-y-2">
                <span className="text-xs font-bold text-zinc-400">Journal title *</span>
                <input value={journalTitle} onChange={(event) => setJournalTitle(event.target.value)} className={fieldClass} placeholder="What did you learn this week?" />
              </label>
              <label className="block space-y-2">
                <span className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-400">
                  <span>Journal content *</span>
                  <span className="rounded-full bg-lime-300/10 px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-lime-300">Table paste supported</span>
                </span>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  data-placeholder="Start writing here, or paste a table from Excel or Word..."
                  className={`${fieldClass} prose prose-invert max-h-[36rem] min-h-80 max-w-none overflow-y-auto focus:border-lime-300/50`}
                />
              </label>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-between rounded-xl bg-lime-300 px-5 py-4 text-sm font-black text-[#202127] transition hover:bg-lime-200 disabled:opacity-40">
                <span>{loading ? "Publishing..." : "Publish journal entry"}</span><span>↗</span>
              </button>
            </form>
          )}

          {message && (
            <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${message.toLowerCase().includes("failed") || message.toLowerCase().includes("stopped") || message.toLowerCase().includes("could not") ? "border-red-400/20 bg-red-400/[0.05] text-red-200" : "border-white/[0.08] bg-white/[0.025] text-zinc-400"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
