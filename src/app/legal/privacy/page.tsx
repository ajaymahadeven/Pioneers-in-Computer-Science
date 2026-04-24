import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Pioneers in Computer Science handles your data.",
};

const LAST_UPDATED = "April 24, 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="border-border border-b">
        <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
          <p className="text-muted-foreground mb-2 text-[10px] font-medium tracking-widest uppercase">
            Legal
          </p>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
        <div className="prose-sm space-y-8">
          <Section title="Overview">
            <p>
              Pioneers in Computer Science is an educational encyclopedia. We
              collect minimal data and do not run advertising, sell data, or
              track users across sites.
            </p>
          </Section>

          <Section title="Data We Collect">
            <p>
              When you visit a pioneer&apos;s page we record a single anonymous
              view event. This event stores:
            </p>
            <ul>
              <li>
                A one-way SHA-256 hash of your IP address — the original IP is
                never stored.
              </li>
              <li>A timestamp.</li>
              <li>The ID of the pioneer page visited.</li>
            </ul>
            <p>
              We use this data solely to show which pioneers are most viewed in
              the admin dashboard. We do not store your name, email, device
              fingerprint, or any other personally identifiable information.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              This site does not set any tracking or advertising cookies. No
              third-party analytics scripts (Google Analytics, Meta Pixel, etc.)
              are loaded.
            </p>
          </Section>

          <Section title="Data Retention">
            <p>
              View events are retained for up to 90 days and then deleted. IP
              hashes are irreversible and cannot be used to identify you
              individually.
            </p>
          </Section>

          <Section title="Third-Party Services">
            <p>
              Portrait images are served via Azure Blob Storage (Microsoft).
              Your browser may make a request to our image proxy at{" "}
              <code>/api/images/</code> — no personal data is sent to Azure
              directly.
            </p>
          </Section>

          <Section title="Your Rights (GDPR / CCPA)">
            <p>
              Because we do not store any data linked to your identity, there is
              nothing to access, correct, or delete. If you have questions,
              contact us at the address below.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy can be directed to{" "}
              <a
                href="https://ajaymahadeven.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                ajaymahadeven.com
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="border-border mt-12 border-t pt-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-foreground mb-3 text-base font-semibold">{title}</h2>
      <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
