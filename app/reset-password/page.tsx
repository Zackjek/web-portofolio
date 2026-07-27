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
    return "This recovery link has expired or was already used. Request a new recovery email from Admin Studio.";
  }

  if (error || errorCode) {
    return "This recovery link is invalid. Request a new recovery email from Admin Studio.";
  }

  return "";
}

function updateErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("same password") ||
    normalizedMessage.includes("different from the old password")
  ) {
    return "The new password must be different from the previous password.";
  }

  if (
    normalizedMessage.includes("weak password") ||
    normalizedMessage.includes("at least")
  ) {
    return "The password does not meet the security requirements. Use at least 8 characters and choose a hard-to-guess combination.";
  }

  if (
    normalizedMessage.includes("session") ||
    normalizedMessage.includes("jwt")
  ) {
    return "The recovery session has ended. Request a new recovery email from Admin Studio.";
  }

  return "The password could not be saved. Check your connection and try again.";
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
            "No recovery session was found. The link may have expired or already been used.",
        );
        setMessageTone("error");
        return;
      }

      const email = session.user.email?.toLowerCase() ?? "";
      if (email !== ADMIN_EMAIL) {
        setRecoveryState("denied");
        setMessage("The account associated with this link does not have Admin Studio access.");
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
      setMessage("Supabase is not configured for this deployment.");
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
            "The recovery session could not be verified. Request a new recovery email from Admin Studio.",
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
          "The recovery session could not be verified. Request a new recovery email from Admin Studio.",
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
      setMessage("Use a password with at least 8 characters.");
      setMessageTone("error");
      return;
    }

    if (password !== confirmation) {
      setMessage("The password confirmation does not match.");
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
      setMessage("The password could not be saved. Please try again later.");
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
            Checking recovery link
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
            Password saved
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
            Your admin password is ready
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-500">
            The recovery session has been closed. You can now sign in with the
            password you just created.
          </p>
          <Link
            href="/admin"
            className="mt-8 inline-flex w-full items-center justify-between rounded-xl bg-lime-300 px-5 py-4 text-sm font-black text-[#202127] transition hover:bg-lime-200"
          >
            <span>Sign in to Admin Studio</span>
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
            Link unavailable
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
            Request a new recovery link
          </h1>
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4 text-sm leading-6 text-red-200"
          >
            {message}
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-500">
            Open Admin Studio, request a new recovery email, then use the link
            in the newest message once. Older links cannot be reused.
          </p>
          <Link
            href="/admin"
            className="mt-7 inline-flex w-full items-center justify-between rounded-xl border border-white/10 px-5 py-4 text-sm font-bold text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            <span>Back to Admin Studio</span>
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
          Create a new admin password
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-500">
          Use at least 8 characters. Your password is stored as a secure hash
          and verified directly by Supabase Auth.
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
              New password
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
                placeholder="At least 8 characters"
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

          <label className="block space-y-2">
            <span className="text-xs font-bold text-zinc-400">
              Confirm new password
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
              placeholder="Re-enter your password"
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
            <span>{updating ? "Saving..." : "Save New Password"}</span>
            <span>↗</span>
          </button>
        </form>
      </div>
    </section>
  );
}
