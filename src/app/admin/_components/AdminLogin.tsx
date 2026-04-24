"use client";

const ERROR_MESSAGES: Record<string, string> = {
  denied: "Access denied. GitHub identity not authorised.",
  session_expired: "Session expired. Re-authentication required.",
  no_code: "No authorisation code received.",
  token_exchange: "Token exchange failed.",
  user_fetch: "Could not retrieve GitHub profile.",
};

export function AdminLogin({ error }: { error?: string }) {
  const errorMsg = error ? (ERROR_MESSAGES[error] ?? "Unknown error.") : null;

  return (
    <div
      className="dot-grid-light dark:dot-grid flex min-h-screen items-center justify-center bg-white dark:bg-black"
      suppressHydrationWarning
    >
      <div className="border-border bg-card w-full max-w-sm rounded-lg border p-8 shadow-sm">
        {/* Header */}
        <div className="border-border mb-6 border-b pb-4">
          <div className="border-border bg-muted mb-3 flex h-9 w-9 items-center justify-center rounded border">
            <span className="text-foreground font-mono text-sm font-bold">
              P
            </span>
          </div>
          <p className="text-muted-foreground mb-0.5 text-[10px] font-medium tracking-widest uppercase">
            Pioneers in CS
          </p>
          <h1 className="text-foreground text-xl font-semibold tracking-tight">
            Admin access
          </h1>
        </div>

        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Restricted area. Authenticate with your GitHub account to continue.
        </p>

        {errorMsg && (
          <div className="border-destructive/30 bg-destructive/8 mb-5 rounded border px-3 py-2.5">
            <p className="text-destructive text-xs">{errorMsg}</p>
          </div>
        )}

        <a
          href="/api/auth/admin/github"
          className="border-border bg-muted text-foreground hover:bg-accent flex w-full items-center justify-center gap-2.5 rounded border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
            aria-hidden
          >
            <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.467-1.334-5.467-5.93 0-1.31.468-2.382 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.192.694.8.577C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </a>

        <p className="text-muted-foreground/50 mt-5 text-center font-mono text-[10px] tracking-widest uppercase">
          Authorised access only
        </p>
      </div>
    </div>
  );
}
