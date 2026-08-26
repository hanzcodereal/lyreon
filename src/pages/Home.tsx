import { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import TrackRow from "@/components/TrackRow";
import type { Track } from "@/types";
import { searchSongs } from "@/lib/api";

export default function Home() {
  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchSongs("musik indonesia").then(setTracks).catch(() => setTracks([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-6">
      <div>
        <p className="text-sm text-muted">{greeting}</p>
        <h1 className="font-display text-3xl italic text-ivory">Apa yang mau didengar?</h1>
        <p className="mt-2 text-sm text-muted">Konten musik diambil dari API yang tersedia di folder <code>/api</code>.</p>
      </div>

      <section>
        <SectionHeader title="Musik Indonesia" subtitle="Hasil terbaru dari sumber musik" />
        <div className="rounded-2xl border border-line bg-surface/50 p-2">
          {loading && <p className="px-3 py-5 text-sm text-muted">Memuat lagu...</p>}
          {!loading && tracks.length === 0 && <p className="px-3 py-5 text-sm text-muted">API belum mengembalikan lagu.</p>}
          {tracks.map((track, i) => <TrackRow key={track.id} track={track} index={i} queue={tracks} />)}
        </div>
      </section>
    </div>
  );
}
