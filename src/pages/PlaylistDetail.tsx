import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Playlist, Track } from "@/types";
import { getPlaylist } from "@/lib/api";
import { usePlayerStore } from "@/store/playerStore";
import Artwork from "@/components/Artwork";
import TrackRow from "@/components/TrackRow";

export default function PlaylistDetail() {
  const { id } = useParams();
  const playQueue = usePlayerStore((s) => s.playQueue);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getPlaylist(id)
      .then(({ playlist: data, tracks: apiTracks }) => {
        setPlaylist(data);
        setTracks(apiTracks);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat playlist dari API."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-muted">Memuat playlist dari API...</p>;
  if (error || !playlist) {
    return (
      <div className="space-y-2 pb-6">
        <p className="text-sm text-muted">{error || "Playlist tidak ditemukan dari API."}</p>
        <Link to="/library" className="text-sm text-rose-light">Kembali ke Koleksi</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
        <Artwork title={playlist.title} artworkUrl={playlist.coverUrl} size={160} rounded="rounded-2xl" className="shadow-glow" />
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Playlist API</p>
          <h1 className="font-display text-3xl italic text-ivory">{playlist.title}</h1>
          {playlist.description && <p className="mt-1 text-sm text-muted">{playlist.description}</p>}
          <button
            disabled={!tracks.length}
            onClick={() => playQueue(tracks, 0)}
            className="mt-4 rounded-full bg-gradient-to-r from-rose to-rose-light px-6 py-2.5 text-sm font-medium text-ink shadow-glow disabled:opacity-40"
          >
            ▶ Putar semua
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface/50 p-2">
        {tracks.length === 0 && <p className="px-3 py-5 text-sm text-muted">API tidak mengembalikan lagu untuk playlist ini.</p>}
        {tracks.map((track, i) => <TrackRow key={track.id} track={track} index={i} queue={tracks} />)}
      </div>
    </div>
  );
}
