import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-white/15 bg-white/8">
                <Image src="/logo.svg" alt="" width={18} height={18} />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Pioneers in CS
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/40">
              An encyclopedia of the minds that built the digital world — from
              ancient mathematics to modern AI.
            </p>
            <p className="font-mono text-xs text-white/20">
              © {new Date().getFullYear()} Pioneers in Computer Science
            </p>
          </div>

          {/* Navigate */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-medium tracking-widest text-white/30 uppercase">
              Navigate
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/explore", label: "Explore All Pioneers" },
                { href: "/random", label: "Random Pioneer" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-white/45 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-medium tracking-widest text-white/30 uppercase">
              Data Sources
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "https://www.wikidata.org", label: "Wikidata" },
                { href: "https://en.wikipedia.org", label: "Wikipedia" },
                {
                  href: "https://github.com/ajaymahadeven/Pioneers-in-Computer-Science",
                  label: "GitHub",
                },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/45 transition-colors hover:text-white"
                >
                  {label} ↗
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/8 pt-6">
          <p className="text-center font-mono text-xs text-white/18">
            Built with Next.js · tRPC · PostgreSQL · Azure Blob Storage
          </p>
        </div>
      </div>
    </footer>
  );
}
