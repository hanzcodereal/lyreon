import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Artwork from "@/components/Artwork";
import TrackRow from "@/components/TrackRow";
import { getArtist } from "@/lib/api";
import type { Track } from "@/types";

export default function Artist() {
  const { id } = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getArtist(id).then(setArtist).catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat artis dari API.")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-muted">Memuat artis dari API...</p>;
  if (error || !artist) return <div className="space-y-2"><p className="text-sm text-muted">{error || "Artis tidak ditemukan dari API."}</p><Link to="/search" className="text-sm text-rose-light">Kembali ke pencarian</Link></div>;

  const tracks = artist.topSongs as Track[];
  return <div className="space-y-6 pb-6">
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
      <Artwork title={artist.name} artworkUrl={artist.artworkUrl} size={160} rounded="rounded-full" className="shadow-glow" />
      <div><p className="text-xs uppercase tracking-widest text-muted">Artis dari API</p><h1 className="font-display text-3xl italic text-ivory">{artist.name}</h1></div>
    </div>
    <section><h2 className="mb-3 font-display text-xl italic text-ivory">Lagu populer</h2><div className="rounded-2xl border border-line bg-surface/50 p-2">{tracks.length ? tracks.map((t,i)=><TrackRow key={t.id} track={t} index={i} queue={tracks}/>) : <p className="px-3 py-5 text-sm text-muted">API belum mengembalikan lagu artis ini.</p>}</div></section>
  </div>;
                                 }
