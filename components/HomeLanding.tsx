import type { ReactNode } from "react";
import BrandMark from "@/components/BrandMark";
import ChartAnswers from "@/components/ChartAnswers";
import ZodiacBackdrop from "@/components/ZodiacBackdrop";
import { withBasePath } from "@/lib/base-path";

const claims = [
  {
    title: "Qualified",
    text: "A qualified astrologer draws your chart. The work is not handed to software.",
  },
  {
    title: "Experienced",
    text: "The reading comes from years of practice, not from a prompt.",
  },
  {
    title: "Handwritten kundli",
    text: "The birth chart is drawn on paper from your date, time, and place.",
  },
  {
    title: "Handwritten answers",
    text: "The replies are written in the same hand. Nothing is generated.",
  },
];

const steps = [
  {
    n: "01",
    title: "Send your birth details",
    text: "Name, date, exact time, and place of birth. The fee is ₹499.",
  },
  {
    n: "02",
    title: "The astrologer draws it",
    text: "Your kundli is prepared by hand. The answers are written by hand.",
  },
  {
    n: "03",
    title: "It reaches you",
    text: "The handwritten kundli and the handwritten answers are sent to your WhatsApp number.",
  },
];

export default function HomeLanding({ form }: { form: ReactNode }) {
  return (
    <div id="top" className="relative min-h-screen bg-cream text-ink">
      <ZodiacBackdrop />

      <header className="sticky top-0 z-30 border-b border-gold/30 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandMark href="#top" />
          <a
            href="#request"
            className="rounded-full bg-plum px-4 py-2 text-sm font-semibold text-gold-soft shadow-sm transition hover:bg-plum-dark"
          >
            Request kundli
          </a>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              On paper
            </p>
            <h1 className="font-headline mt-4 text-5xl font-medium leading-[0.95] text-plum sm:text-6xl lg:text-7xl">
              More than just a kundli.
              <br />
              Drawn by hand.
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-snug font-medium text-plum sm:text-2xl">
              100% done by qualified astrologers. No AI, no machines.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/80">
              You came for an answer, not a printout. Marriage, work, the years just ahead. Send the minute and place you were born. A qualified astrologer draws your chart by hand and writes what it means. That answer comes to your WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#request"
                className="inline-flex items-center justify-center rounded-full bg-plum px-6 py-3.5 text-base font-semibold text-gold-soft shadow-lg transition hover:bg-plum-dark"
              >
                Request your handwritten kundali at Rs499
              </a>
            </div>
          </div>

          <ChartAnswers />
        </section>

        <section className="border-y border-gold/30 bg-plum text-gold-soft">
          <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-8 px-4 py-10 sm:px-6 sm:py-12 sm:grid-cols-2 xl:grid-cols-4">
            {claims.map((claim) => (
              <div key={claim.title}>
                <h2 className="font-display text-3xl font-semibold leading-none text-gold">{claim.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gold-soft/90">{claim.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <img
            src={withBasePath("/handwritten-kundli.jpg")}
            alt="A kundli drawn in plum ink on handmade paper, with a brass pen beside it"
            className="w-full rounded-[1.75rem] shadow-[0_18px_50px_rgba(58,21,52,0.12)]"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">The chart</p>
            <h2 className="font-display mt-3 text-4xl font-semibold leading-tight text-plum sm:text-5xl">
              The kundli is made with a pen.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink/80">
              A kundli needs your date, your exact time, and your place of birth. From those, the astrologer draws the houses and places the planets. That drawing is yours. It is not downloaded, and it is not produced by software.
            </p>
            <ul className="mt-6 space-y-3 text-base text-ink/85">
              <li>The chart is drawn on paper.</li>
              <li>The reading is written in the astrologer’s own words.</li>
              <li>The answers stay in that same handwriting.</li>
            </ul>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pb-24">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">No machine</p>
            <h2 className="font-display mt-3 text-4xl font-semibold leading-tight text-plum sm:text-5xl">
              No AI writes any part of this.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink/80">
              There is no chatbot, no instant reading, and no paragraph written by a model. If it cannot be written with a pen, it is not part of your kundli.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/80">
              The same qualified astrologer who draws the chart writes the answers. You are not reading a template with your name dropped in.
            </p>
          </div>
          <div className="order-1 overflow-hidden rounded-[1.75rem] shadow-[0_18px_50px_rgba(58,21,52,0.12)] lg:order-2">
            <img
              src={`${withBasePath("/writing-hand.jpg")}?v=2`}
              alt="A hand writing a chart with a fountain pen"
              className="aspect-[4/3] w-full object-cover object-center"
            />
          </div>
        </section>

        <section className="border-t border-gold/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <h2 className="font-display text-4xl font-semibold text-plum sm:text-5xl">How your kundli is prepared</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <article key={step.n} className="rounded-3xl border border-gold/40 bg-white/75 p-6">
                  <p className="text-sm font-semibold tracking-[0.18em] text-gold">{step.n}</p>
                  <h3 className="mt-3 text-lg font-semibold text-plum">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="service" className="scroll-mt-20 border-t border-gold/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Other details</p>
            <h2 className="font-display mt-3 text-4xl font-semibold text-plum sm:text-5xl">
              The service and the price
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
              One service is sold on this website. The price is shown in Indian Rupees.
            </p>
            <article className="mt-8 max-w-3xl rounded-[1.75rem] border border-gold/40 bg-white/80 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Product / service</p>
              <h3 className="font-display mt-2 text-3xl font-semibold text-plum">Handwritten Kundli</h3>
              <p className="mt-4 leading-relaxed text-ink/80">
                A qualified, experienced astrologer draws your birth chart by hand and writes the answers by hand. No AI is used. The handwritten kundli and the handwritten answers are sent to your WhatsApp number.
              </p>
              <dl className="mt-6 grid gap-4 border-t border-gold/30 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Price</dt>
                  <dd className="mt-1 text-3xl font-semibold text-plum">₹499</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Currency</dt>
                  <dd className="mt-1 text-lg text-ink">INR</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Charged at checkout</dt>
                  <dd className="mt-1 text-lg text-ink">₹499 INR</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        <section id="request" className="scroll-mt-20 px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Begin</p>
              <h2 className="font-display mt-3 text-4xl font-semibold text-plum sm:text-5xl">
                Tell the astrologer when and where you were born.
              </h2>
              <p className="mt-3 text-base text-ink/75">
                The chart can only be drawn from your name, date of birth, exact birth time, and birth place.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-gold/40 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
              {form}
            </div>
            <p className="mt-4 text-center text-sm text-ink/60">
              Secure payment by Cashfree. Your birth details are kept even if payment does not finish.
            </p>
          </div>
        </section>
      </main>

    </div>
  );
}
