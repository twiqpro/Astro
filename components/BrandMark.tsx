import { withBasePath } from "@/lib/base-path";

export default function BrandMark({ href }: { href: string }) {
  return (
    <a href={href} className="flex items-center gap-2.5 text-plum">
      <img
        src={withBasePath("/moolank-logo.png")}
        alt=""
        className="h-9 w-9"
      />
      <span className="font-display text-2xl font-semibold tracking-tight">moolank</span>
    </a>
  );
}
