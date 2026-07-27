"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type RecoveryState =
  | "checking"
  | "ready"
  | "invalid"
  | "denied"
  | "success";
type MessageTone = "neutral" | "error";

const ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
  "muhammadzakymubarok@student.telkomuniversity.ac.id"
).toLowerCase();

const fieldClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#080d11] px-4 py-3 text-sm text-white placeholder:text-zinc-700 transition focus:border-lime-300/50 focus:outline-none";

function recoveryErrorFromUrl() {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const errorCode = hash.get("error_code") ?? query.get("error_code");
  const error = hash.get("error") ?? query.get("error");

  if (errorCode === "otp_expired") {
    return "Link reset sudah kedaluwarsa atau pernah digunakan. Minta email reset baru dari halaman Admin Studio.";
  }

  if (error || errorCode) {
    return "Link reset tidak valid. Minta email reset baru dari halaman Admin Studio.";
  }

  return "";
}

function updateErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("same password") ||
    normalizedMessage.includes("different from the old password")
  ) {
    return "Password baru harus berbeda dari password sebelumnya.";
  }

  if (
    normalizedMessage.includes("weak password") ||
    normalizedMessage.includes("at least")
  ) {
    return "Password belum memenuhi aturan keamanan. Gunakan minimal 8 karakter dengan kombinasi yang sulit ditebak.";
  }

  if (
    normalizedMessage.includes("session") ||
    normalizedMessage.includes("jwt")
  ) {
    return "Sesi reset sudah berakhir. Minta email reset baru dari halaman Admin Studio.";
  }

  return "Password belum berhasil disimpan. Periksa koneksi lalu coba lagi.";
}

export default function ResetPasswordPage() {
  const [recoveryState, setRecoveryState] =
    useState<RecoveryState>("checking");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("neutral");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const urlError = recoveryErrorFromUrl();

    const applySession = (session: Session | null) => {
      if (!active || completedRef.current) return;

      if (!session) {
        setRecoveryState("invalid");
        setMessage(
          urlError ||
            "Sesi reset tidak ditemukan. Link mungkin sudah digunakan atau kedaluwarsa.",
        );
        setMessageTone("error");
        return;
      }

      const email = session.user.email?.toLowerCase() ?? "";
      if (email !== ADMIN_EMAIL) {
        setRecoveryState("denied");
        setMessage("Akun pada link ini tidak memiliki akses Admin Studio.");
        setMessageTone("error");
        void supabase.auth.signOut({ scope: "local" });
        return;
      }

      window.history.replaceState({}, "", "/reset-password");
      setRecoveryState("ready");
      setMessage("");
      setMessageTone("neutral");
    };

    if (!isSupabaseConfigured) {
      setRecoveryState("invalid");
      setMessage("Konfigurasi Supabase belum tersedia pada deployment ini.");
      setMessageTone("error");
      return;
    }

    if (urlError) {
      setRecoveryState("invalid");
      setMessage(urlError);
      setMessageTone("error");
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "PASSWORD_RECOVERY" ||
          event === "INITIAL_SESSION" ||
          event === "SIGNED_IN"
        ) {
          applySession(session);
        }
      },
    );

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          if (!active) return;
          setRecoveryState("invalid");
          setMessage(
            "Sesi reset tidak dapat diperiksa. Minta email reset baru dari halaman Admin Studio.",
          );
          setMessageTone("error");
          return;
        }

        applySession(data.session);
      })
      .catch(() => {
        if (!active) return;
        setRecoveryState("invalid");
        setMessage(
          "Sesi reset tidak dapat diperiksa. Minta email reset baru dari halaman Admin Studio.",
        );
        setMessageTone("error");
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      setMessage("Gunakan password minimal 8 karakter.");
      setMessageTone("error");
      return;
    }

    if (password !== confirmation) {
      setMessage("Konfirmasi password belum sama.");
      setMessageTone("error");
      return;
    }

    setUpdating(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage(updateErrorMessage(error.message));
        setMessageTone("error");
        return;
      }

      completedRef.current = true;
      setPassword("");
      setConfirmation("");
      setRecoveryState("success");
      setMessage("");
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      setMessage("Password belum berhasil disimpan. Coba lagi nanti.");
      setMessageTone("error");
    } finally {
      setUpdating(false);
    }
  };

  if (recoveryState === "checking") {
    return (
      <section className="section-pad page-shell grid min-h-[80vh] place-items-center pt-32">
        <div className="text-center">
          <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" />
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
            Memeriksa link reset
          </p>
        </div>
      </section>
    );
  }

  if (recoveryState === "success") {
    return (
      <section className="section-pad page-shell grid min-h-[88vh] place-items-center pt-32">
        <div className="glass-card w-full max-w-lg rounded-[1.7rem] p-6 text-center md:p-9">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-lime-300/20 bg-lime-300/[0.07] text-2xl text-lime-300">
            ✓
          </span>
          <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.18em] text-lime-300">
            Password tersimpan
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
            Password admin sudah dibuat
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Sesi reset sudah ditutup. Sekarang masuk menggunakan password baru
            yang barusan kamu buat.
          </p>
          <Link
            href="/admin"
            className="mt-8 inline-flex w-full items-center justify-between rounded-xl bg-lime-300 px-5 py-4 text-sm font-black text-[#202127] transition hover:bg-lime-200"
          >
            <span>Masuk ke Admin Studio</span>
            <span>↗</span>
          </Link>
        </div>
      </section>
    );
  }

  if (recoveryState !== "ready") {
    return (
      <section className="section-pad page-shell grid min-h-[88vh] place-items-center pt-32">
        <div className="glass-card w-full max-w-lg rounded-[1.7rem] p-6 md:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-amber-300/15 bg-amber-300/[0.05] text-amber-200">
            !
          </span>
          <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200">
            Link tidak dapat digunakan
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
            Minta link reset baru
          </h1>
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4 text-sm leading-6 text-red-200"
          >
            {message}
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-500">
            Buka Admin Studio, pilih tombol untuk membuat password, lalu buka
            email terbaru satu kali. Email lama tidak dapat dipakai ulang.
          </p>
          <Link
            href="/admin"
            className="mt-7 inline-flex w-full items-center justify-between rounded-xl border border-white/10 px-5 py-4 text-sm font-bold text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            <span>Kembali ke Admin Studio</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    );
  }

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
          Secure password recovery
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
          Buat password admin baru
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-500">
          Gunakan minimal 8 karakter. Password disimpan sebagai hash dan
          diverifikasi langsung oleh Supabase Auth.
        </p>

        {message && (
          <div
            role={messageTone === "error" ? "alert" : "status"}
            className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${
              messageTone === "error"
                ? "border-red-400/20 bg-red-400/[0.05] text-red-200"
                : "border-white/[0.08] bg-white/[0.025] text-zinc-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={updatePassword} className="mt-7 space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-bold text-zinc-400">
              Password baru
            </span>
            <span className="relative block">
              <input
                type={showPassword ? "text" : "password"}
                name="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                autoFocus
                className={`${fieldClass} pr-24`}
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 my-auto h-fit rounded-lg px-2 py-1 text-[10px] font-bold text-zinc-600 transition hover:text-lime-300"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                aria-pressed={showPassword}
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </span>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold text-zinc-400">
              Ulangi password baru
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="confirm-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className={fieldClass}
              placeholder="Ketik ulang password"
            />
          </label>

          <button
            type="submit"
            disabled={
              updating ||
              password.length < 8 ||
              confirmation.length < 8
            }
            className="flex w-full items-center justify-between rounded-xl bg-lime-300 px-5 py-4 text-sm font-black text-[#202127] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>{updating ? "Menyimpan..." : "Simpan Password Baru"}</span>
            <span>↗</span>
          </button>
        </form>
      </div>
    </section>
  );
}
