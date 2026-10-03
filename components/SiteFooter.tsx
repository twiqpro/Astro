import BrandMark from "@/components/BrandMark";
import { withBasePath } from "@/lib/base-path";

const links = [
  { href: "/contact", label: "Contact Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refunds", label: "Refunds & Cancellations" },
  { href: "/privacy", label: "Privacy" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gold/30 bg-cream px-4 py-10 text-sm text-ink/75 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <BrandMark href={withBasePath("/")} />
          <p className="mt-2 max-w-sm leading-relaxed">
            Handwritten Kundli by a qualified astrologer. Price ₹499 INR.
          </p>
          <p className="mt-2">
            <a className="underline decoration-gold/70 underline-offset-2" href="mailto:twiq.pro@gmail.com">
              twiq.pro@gmail.com
            </a>
          </p>
          <p className="mt-2 text-xs text-ink/55">TWIQ RESEARCH (OPC) PVT LTD</p>
        </div>
        <nav className="flex flex-col gap-2" aria-label="Policies">
          {links.map((link) => (
            <a key={link.href} href={withBasePath(link.href)} className="hover:text-plum">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
