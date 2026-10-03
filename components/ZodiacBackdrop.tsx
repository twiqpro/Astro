import { withBasePath } from "@/lib/base-path";

export default function ZodiacBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={`${withBasePath("/zodiac-wheel.svg")}?v=2`}
        alt=""
        className="absolute left-1/2 top-[42%] w-[920px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-30 sm:w-[1080px]"
      />
    </div>
  )
}
