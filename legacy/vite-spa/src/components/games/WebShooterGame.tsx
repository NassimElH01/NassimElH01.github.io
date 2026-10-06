import { useState } from "react";
import { Shield, Sparkles, Hand } from "lucide-react";

type Hero = "spiderman" | "wolverine";

export default function WebShooterGame() {
  const [hero, setHero] = useState<Hero | null>(null);

  if (!hero) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl">
        <div className="mb-8 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
          <h3 className="text-2xl font-bold">Choose your hero</h3>
          <p className="mt-2 text-sm text-slate-400">Your powers are loaded into the game after you choose.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <button type="button" onClick={() => setHero("spiderman")} className="group rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/70 to-slate-900 p-6 text-left transition hover:-translate-y-1 hover:border-rose-400">
            <Shield className="mb-8 h-10 w-10 text-rose-400 transition group-hover:scale-110" />
            <h4 className="text-xl font-bold">Spider-Man</h4>
            <p className="mt-2 text-sm text-slate-400">Use your web-slinging gesture to fire webs at the target.</p>
            <span className="mt-6 inline-block text-sm font-semibold text-rose-300">Enter as Spider-Man →</span>
          </button>
          <button type="button" onClick={() => setHero("wolverine")} className="group rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/70 to-slate-900 p-6 text-left transition hover:-translate-y-1 hover:border-amber-400">
            <Hand className="mb-8 h-10 w-10 text-amber-300 transition group-hover:scale-110" />
            <h4 className="text-xl font-bold">Wolverine</h4>
            <p className="mt-2 text-sm text-slate-400">Clench your fist to extend Wolverine's claws.</p>
            <span className="mt-6 inline-block text-sm font-semibold text-amber-300">Enter as Wolverine →</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video min-h-[480px] overflow-hidden rounded-lg bg-[#0f0f18]">
      <iframe
        title={`${hero === "spiderman" ? "Spider-Man Web Shooter" : "Wolverine Claws"} game`}
        src={`${import.meta.env.BASE_URL}games/web-shooter/index.html?hero=${hero}`}
        className="h-full w-full border-0"
        allow="camera; microphone 'none'"
      />
    </div>
  );
}
