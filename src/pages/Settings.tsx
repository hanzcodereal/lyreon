import { usePlayerStore } from "@/store/playerStore";

export default function Settings() {
  const { volume, setVolume } = usePlayerStore();

  return (
    <div className="max-w-lg space-y-8 pb-6">
      <h1 className="font-display text-3xl italic text-ivory">Pengaturan</h1>

      <section className="rounded-2xl border border-line bg-surface/50 p-4">
        <h2 className="mb-3 text-sm font-medium text-ivory">Audio</h2>
        <label className="flex items-center justify-between text-sm text-muted">
          Volume default
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="ml-4 w-40 accent-rose"
          />
        </label>
      </section>


      <section className="rounded-2xl border border-line bg-surface/50 p-4 text-xs leading-relaxed text-muted">
        <h2 className="mb-2 text-sm font-medium text-ivory">Tentang</h2>
        Lyreon Web · pemutar musik yang menggunakan endpoint API di folder /api.
      </section>
    </div>
  );
}
