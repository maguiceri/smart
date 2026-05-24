"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const PARTS = [
  {
    src: "/screen.png",
    label: "Ceramic Shield",
    description: "Vidrio con nanocristales cerámicos. 4× más resistente a las caídas.",
    startX: 0, startY: 0,
    targetX: -60,  targetY: 200,
    mtX: 0,        mtY: 155,
    rotation: 4,
    side: "left" as const,
    z: 30, step: "03",
    w: 300, h: 300,
    mw: 190, mh: 190,
    alwaysVisible: true,
  },
  {
    src: "/phone.png",
    label: "Super Retina XDR",
    description: "OLED 6.7\" ProMotion 120Hz. Brillo pico de 2000 nits.",
    startX: 0, startY: 0,
    targetX: -230, targetY: -165,
    mtX: -85,      mtY: -145,
    rotation: -8,
    side: "left" as const,
    z: 20, step: "01",
    w: 400, h: 267,
    mw: 250, mh: 167,
    alwaysVisible: false,
  },
  {
    src: "/base.png",
    label: "Marco de Titanio",
    description: "Titanio grado aeroespacial. 40% más ligero que el acero.",
    startX: 0, startY: 0,
    targetX: 220,  targetY: 0,
    mtX: 85,       mtY: 10,
    rotation: 7,
    side: "right" as const,
    z: 10, step: "02",
    w: 420, h: 280,
    mw: 260, mh: 173,
    alwaysVisible: false,
  },
] as const;


function cubicEase(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export default function PhoneExplode() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const p          = cubicEase(Math.min(scrollPct * 1.5, 1));
  const partAlpha  = (always: boolean) =>
    always ? 1 : Math.max(0, Math.min(1, (scrollPct - 0.28) / 0.18));
  const titleAlpha = Math.max(0, 1 - scrollPct * 2.8);
  const showPanel  = scrollPct > 0.38;

  return (
    <section ref={wrapperRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen bg-[#060606]">

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 52%, #1c0835 0%, transparent 70%)",
          }}
        />

        {/* Title */}
        <div
          className="absolute top-10 inset-x-0 z-40 text-center pointer-events-none"
          style={{ opacity: titleAlpha }}
        >
          <h2 className="text-white text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Ingeniería<br />reimaginada
          </h2>
          <p className="text-zinc-600 mt-3 text-[10px] sm:text-xs tracking-[0.22em] sm:tracking-[0.28em] uppercase">
            Scroll para descubrir cada componente
          </p>
        </div>

        {/* Phone anchor — centered + slight downward offset to clear the title */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: 1,
            height: 1,
            transform: `translateY(${mobile ? "5vh" : "3vh"})`,
          }}
        >
          {PARTS.map((part) => {
            const tx0 = mobile ? part.mtX : part.targetX;
            const ty0 = mobile ? part.mtY : part.targetY;
            const w   = mobile ? part.mw  : part.w;
            const h   = mobile ? part.mh  : part.h;

            const x  = part.startX + p * (tx0 - part.startX);
            const y  = part.startY + p * (ty0 - part.startY);
            const r  = p * part.rotation;
            const tx = x - w / 2;
            const ty = y - h / 2;

            return (
              <div
                key={part.src}
                className="absolute"
                style={{
                  zIndex: part.z,
                  left: 0, top: 0,
                  width: w, height: h,
                  opacity: partAlpha(part.alwaysVisible),
                  transform: `translate(${tx}px, ${ty}px) rotate(${r}deg)`,
                  willChange: "transform, opacity",
                }}
              >
                <Image
                  src={part.src}
                  alt={part.label}
                  fill
                  sizes={`${w}px`}
                  className="object-contain"
                  style={{
                    filter: showPanel ? "brightness(0.35)" : "brightness(1)",
                    transition: "filter 0.5s ease",
                  }}
                  priority
                />

                {/* Description on top of the part */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center pointer-events-none"
                  style={{
                    opacity: showPanel ? 1 : 0,
                    transition: "opacity 0.5s ease 0.15s",
                  }}
                >
                  <span className="block text-white/30 text-[9px] font-mono tracking-widest mb-1">
                    {part.step}
                  </span>
                  <span className="block text-white text-[11px] sm:text-sm font-semibold tracking-wide leading-tight">
                    {part.label}
                  </span>
                  <p className="text-zinc-300 text-[9px] sm:text-[11px] leading-snug mt-1.5 max-w-[120px] sm:max-w-none">
                    {part.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
