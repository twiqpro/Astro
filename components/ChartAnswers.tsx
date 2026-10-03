const plum = "#4c1d45";
const gold = "#c6a15a";

function diamond(cx: number, cy: number, r: number) {
  const top: [number, number] = [cx, cy - r];
  const right: [number, number] = [cx + r, cy];
  const bottom: [number, number] = [cx, cy + r];
  const left: [number, number] = [cx - r, cy];
  const inner: [number, number][] = [
    [cx + r / 2, cy - r / 2],
    [cx + r / 2, cy + r / 2],
    [cx - r / 2, cy + r / 2],
    [cx - r / 2, cy - r / 2],
  ];
  const dots: [number, number][] = [top, right, bottom, left, [cx, cy], ...inner];
  const outer = `M ${top[0]} ${top[1]} L ${right[0]} ${right[1]} L ${bottom[0]} ${bottom[1]} L ${left[0]} ${left[1]} Z`;
  const cross = `M ${top[0]} ${top[1]} L ${bottom[0]} ${bottom[1]} M ${left[0]} ${left[1]} L ${right[0]} ${right[1]}`;
  const innerPath = `M ${inner[0][0]} ${inner[0][1]} L ${inner[1][0]} ${inner[1][1]} L ${inner[2][0]} ${inner[2][1]} L ${inner[3][0]} ${inner[3][1]} Z`;
  return { dots, outer, cross, innerPath };
}

function Chart({
  cx,
  cy,
  r,
  label,
}: {
  cx: number;
  cy: number;
  r: number;
  label: string;
}) {
  const { dots, outer, cross, innerPath } = diamond(cx, cy, r);
  return (
    <g>
      <path d={outer} fill="none" stroke={gold} strokeWidth="1.4" />
      <path d={cross} fill="none" stroke={gold} strokeWidth="1" opacity="0.85" />
      <path d={innerPath} fill="none" stroke={plum} strokeWidth="1" opacity="0.45" />
      {dots.map(([x, y]) => (
        <circle key={`${label}-${x}-${y}`} cx={x} cy={y} r="3.2" fill={plum} />
      ))}
    </g>
  );
}

export default function ChartAnswers() {
  const d9 = diamond(214, 248, 118);
  const d10 = diamond(438, 392, 108);
  const marriageDot = d9.dots[1];
  const careerDot = d10.dots[2];

  return (
    <figure className="relative overflow-hidden rounded-[2rem] border border-gold/40 bg-[#fbf8f2] shadow-[0_24px_60px_rgba(58,21,52,0.18)]">
      <svg viewBox="0 0 640 640" className="h-auto w-full" role="img" aria-labelledby="chart-answers-title">
        <title id="chart-answers-title">D9 and D10 charts linked onward to Ashtavarga and Shadbala</title>
        <path
          d={`M ${marriageDot[0]} ${marriageDot[1]} C 390 160, 470 120, 520 108`}
          fill="none"
          stroke={gold}
          strokeWidth="1.6"
          strokeDasharray="2 5"
        />
        <path
          d={`M ${careerDot[0]} ${careerDot[1]} C 470 520, 250 560, 168 548`}
          fill="none"
          stroke={gold}
          strokeWidth="1.6"
          strokeDasharray="2 5"
        />
        <path
          d={`M ${marriageDot[0]} ${marriageDot[1]} C 360 300, 360 330, ${d10.dots[3][0]} ${d10.dots[3][1]}`}
          fill="none"
          stroke={plum}
          strokeWidth="1.3"
          opacity="0.55"
        />
        <Chart cx={214} cy={248} r={118} label="D9" />
        <Chart cx={438} cy={392} r={108} label="D10" />
        <circle cx={marriageDot[0]} cy={marriageDot[1]} r="7" fill="none" stroke={gold} strokeWidth="2" />
        <circle cx={marriageDot[0]} cy={marriageDot[1]} r="3.4" fill={gold} />
        <circle cx={careerDot[0]} cy={careerDot[1]} r="7" fill="none" stroke={gold} strokeWidth="2" />
        <circle cx={careerDot[0]} cy={careerDot[1]} r="3.4" fill={gold} />
        <circle cx="520" cy="108" r="3.4" fill={gold} />
        <text x="616" y="86" textAnchor="end" fill={plum} fontSize="22" fontFamily="var(--font-cormorant), Georgia, serif">
          Ashtavarga
        </text>
        <circle cx="430" cy="168" r="2.6" fill={gold} />
        <circle cx="478" cy="132" r="2.6" fill={gold} />
        <circle cx="168" cy="548" r="3.4" fill={gold} />
        <text x="24" y="590" fill={plum} fontSize="22" fontFamily="var(--font-cormorant), Georgia, serif">
          Shadbala
        </text>
        <circle cx="360" cy="538" r="2.6" fill={gold} />
        <circle cx="250" cy="556" r="2.6" fill={gold} />
        <circle cx="352" cy="318" r="2.6" fill={gold} />

        <g>
          <text x="48" y="78" fill={gold} fontSize="13" letterSpacing="2" fontFamily="var(--font-geist-sans), sans-serif">
            D9 · NAVAMSA
          </text>
          <text x="48" y="112" fill={plum} fontSize="34" fontFamily="var(--font-cormorant), Georgia, serif">
            Marriage
          </text>
          <text x="48" y="142" fill={plum} fontSize="18" fontFamily="var(--font-geist-sans), sans-serif">
            Sep – Oct 2027
          </text>
        </g>
        <g>
          <text x="392" y="548" fill={gold} fontSize="13" letterSpacing="2" fontFamily="var(--font-geist-sans), sans-serif">
            D10 · DASAMSA
          </text>
          <text x="392" y="582" fill={plum} fontSize="34" fontFamily="var(--font-cormorant), Georgia, serif">
            Career boom
          </text>
          <text x="392" y="612" fill={plum} fontSize="18" fontFamily="var(--font-geist-sans), sans-serif">
            Jan – Mar 2028
          </text>
        </g>
      </svg>
      <figcaption className="px-6 pb-5 text-center text-xs leading-relaxed text-ink/60">
        The charts are linked, then the timing is written by hand. This is the shape of an answer, drawn for one birth.
      </figcaption>
    </figure>
  );
}
