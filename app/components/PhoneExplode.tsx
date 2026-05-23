"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// screen.png is 1:1 (1024×1024); phone.png and base.png are 3:2 (1536×1024).
// Display sizes are chosen so the phone subject inside each image
// appears at roughly the same visual height (~240px).
const PARTS = [
  {
    src: "/screen.png",
    label: "Ceramic Shield",
    description:
      "Vidrio con nanocristales cerámicos integrados. 4× más resistente a las caídas.",
    startX: 0,
    startY: 0,
    targetX: -60,
    targetY: 200,
    rotation: 4,
    side: "left" as const,
    z: 30,
    step: "03",
    w: 300,
    h: 300,
    alwaysVisible: true, // the assembled phone shown at rest
  },
  {
    src: "/phone.png",
    label: "Super Retina XDR",
    description:
      "Pantalla OLED de 6.7\" con ProMotion 120Hz y brillo pico de 2000 nits.",
    startX: 0,
    startY: 0,
    targetX: -230,
    targetY: -165,
    rotation: -8,
    side: "left" as const,
    z: 20,
    step: "01",
    w: 400,
    h: 267,
    alwaysVisible: false,
  },
  {
    src: "/base.png",
    label: "Marco de Titanio",
    description:
      "Titanio grado aeroespacial. Más resistente que el acero y un 40% más ligero.",
    startX: 0,
    startY: 0,
    targetX: 220,
    targetY: 0,
    rotation: 7,
    side: "right" as const,
    z: 10,
    step: "02",
    w: 420,
    h: 280,
    alwaysVisible: false,
  },
] as const;

function cubicEase(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export default function PhoneExplode() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const total = el.offsetHeight - window.innerHeight;
      setScrollPct(Math.max(0, Math.min(1, -top / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const p = cubicEase(Math.min(scrollPct * 1.5, 1));
  // Parts with alwaysVisible=false only appear after scroll 28%,
  // by which point they've already moved ~22% toward their targets
  // so they seem to peel off the phone rather than emerge from inside.
  const partAlpha = (alwaysVisible: boolean) =>
    alwaysVisible ? 1 : Math.max(0, Math.min(1, (scrollPct - 0.28) / 0.18));
  const labelAlpha = Math.max(0, Math.min(1, (scrollPct - 0.38) / 0.25));
  const titleAlpha = Math.max(0, 1 - scrollPct * 2.8);

  return (
    <section ref={wrapperRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden bg-[#060606]">
        {/* Ambient purple glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 52%, #1c0835 0%, transparent 70%)",
          }}
        />

        {/* Zone 1 — title */}
        <div
          className="relative z-10 flex-none pt-12 pb-4 text-center pointer-events-none"
          style={{ opacity: titleAlpha }}
        >
          <h2 className="text-white text-5xl font-bold tracking-tight leading-tight">
            Ingeniería
            <br />
            reimaginada
          </h2>
          <p className="text-zinc-600 mt-4 text-xs tracking-[0.28em] uppercase">
            Scroll para descubrir cada componente
          </p>
        </div>

        {/* Zone 2 — phone (flex-1 so it fills the space between title and tagline) */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* 1×1 anchor at the center of this zone */}
          <div className="relative" style={{ width: 1, height: 1 }}>
          {PARTS.map((part) => {
            const x = part.startX + p * (part.targetX - part.startX);
            const y = part.startY + p * (part.targetY - part.startY);
            const r = p * part.rotation;
            // subtract half-dimensions to center the element on the anchor point
            const tx = x - part.w / 2;
            const ty = y - part.h / 2;

            return (
              <div
                key={part.src}
                className="absolute"
                style={{
                  zIndex: part.z,
                  left: 0,
                  top: 0,
                  width: part.w,
                  height: part.h,
                  opacity: partAlpha(part.alwaysVisible),
                  transform: `translate(${tx}px, ${ty}px) rotate(${r}deg)`,
                  willChange: "transform, opacity",
                }}
              >
                <Image
                  src={part.src}
                  alt={part.label}
                  fill
                  sizes={`${part.w}px`}
                  className="object-contain"
                  priority
                />

                {/* Label */}
                <div
                  className={[
                    "absolute top-1/2 -translate-y-1/2 pointer-events-none",
                    "hidden sm:flex items-start gap-3",
                    part.side === "left" ? "right-full" : "left-full",
                  ].join(" ")}
                  style={{ opacity: labelAlpha }}
                >
                  {part.side === "right" && (
                    <div className="mt-[9px] w-8 h-px bg-white/20 flex-shrink-0" />
                  )}
                  <div
                    className={
                      part.side === "left" ? "text-right" : "text-left"
                    }
                  >
                    <span className="block text-white/25 text-[10px] font-mono tracking-widest mb-1">
                      {part.step}
                    </span>
                    <span className="block text-white text-sm font-semibold tracking-wide whitespace-nowrap">
                      {part.label}
                    </span>
                    <p
                      className="text-zinc-500 text-xs leading-relaxed mt-1"
                      style={{ maxWidth: 165 }}
                    >
                      {part.description}
                    </p>
                  </div>
                  {part.side === "left" && (
                    <div className="mt-[9px] w-8 h-px bg-white/20 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Zone 3 — tagline */}
        <div
          className="relative z-10 flex-none pb-10 text-center pointer-events-none"
          style={{ opacity: labelAlpha }}
        >
          <p className="text-zinc-700 text-[11px] tracking-[0.3em] uppercase">
            Smart · Diseñado para resistir
          </p>
        </div>
      </div>
    </section>
  );
}
