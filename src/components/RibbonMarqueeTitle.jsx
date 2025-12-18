import React from "react";

export default function RibbonMarqueeTitle({
  label = "CÁLCULOS",
  title = "Cálculos en acción",
  text = "Cálculos / Presupuesto / APU / Memorias / Excel /",
}) {
  return (
    <div className="relative w-full">
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-50%,0,0); }
        }
        @keyframes marqueeRight {
          0% { transform: translate3d(-50%,0,0); }
          100% { transform: translate3d(0,0,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ribbon-track { animation: none !important; transform: translate3d(0,0,0) !important; }
        }
      `}</style>

      <div className="relative h-[170px] md:h-[210px] overflow-hidden">
        {/* Back ribbon */}
        <Ribbon
          text={text}
          top="top-[92px] md:top-[110px]"
          bg="bg-[#6D5CFF]/25"
          color="text-gray-900/30"
          anim="marqueeRight"
          seconds={26}
          z="z-10"
        />

        {/* Front ribbon */}
        <Ribbon
          text={text}
          top="top-[48px] md:top-[56px]"
          bg="bg-[#6D5CFF]"
          color="text-white"
          anim="marqueeLeft"
          seconds={18}
          z="z-20"
        />

        {/* Center title */}
        <div className="relative z-30 flex h-full flex-col items-center justify-start pt-2 text-center">
          <span className="mb-3 inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            {label}
          </span>

          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

function Ribbon({ text, top, bg, color, anim, seconds, z }) {
  return (
    <div
      className={[
        "absolute left-1/2 w-[130vw] -translate-x-1/2 rotate-[-4deg] overflow-hidden",
        top,
        z,
      ].join(" ")}
    >
      <div className={["relative rounded-2xl", bg, "py-5 md:py-6"].join(" ")}>
        <div
          className="ribbon-track flex w-[200%] whitespace-nowrap will-change-transform"
          style={{
            animation: `${anim} ${seconds}s linear infinite`,
            transform: "translateZ(0)",
          }}
        >
          <MarqueeHalf text={text} className={color} />
          <MarqueeHalf text={text} className={color} ariaHidden />
        </div>
      </div>
    </div>
  );
}

function MarqueeHalf({ text, className, ariaHidden = false }) {
  return (
    <div className="flex w-1/2 items-center" aria-hidden={ariaHidden ? "true" : undefined}>
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className={[
            "mx-8 md:mx-12 font-semibold tracking-wide",
            "text-3xl md:text-5xl",
            className,
          ].join(" ")}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
