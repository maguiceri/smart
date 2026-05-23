import PhoneExplode from "./components/PhoneExplode";

export default function Home() {
  return (
    <main className="bg-[#060606]">
      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center">
        <p className="text-zinc-600 text-xs tracking-[0.35em] uppercase mb-6">
          Presentamos
        </p>
        <h1 className="text-white text-8xl font-bold tracking-tighter">
          smart.
        </h1>
        <p className="text-zinc-500 mt-5 text-sm tracking-widest uppercase">
          El teléfono que lo cambia todo
        </p>

        {/* Scroll hint */}
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
          <span className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* Exploded phone animation */}
      <PhoneExplode />

      {/* Footer */}
      <footer className="h-32 flex items-center justify-center border-t border-white/5">
        <p className="text-zinc-700 text-xs tracking-[0.25em] uppercase">
          © 2026 Smart · Todos los derechos reservados
        </p>
      </footer>
    </main>
  );
}
