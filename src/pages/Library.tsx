import { useEffect, useState } from "react";
import type { Playlist, Track } from "@/types";
import { searchPlaylists, searchSongs } from "@/lib/api";
import PlaylistCard from "@/components/PlaylistCard";
import TrackRow from "@/components/TrackRow";

export default function Library() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([searchPlaylists("musik indonesia playlist"), searchSongs("musik indonesia")])
      .then(([playlistData, trackData]) => {
        setPlaylists(playlistData);
        setTracks(trackData);
      })
      .catch(() => {
        setPlaylists([]);
        setTracks([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-6">
      <div>
        <h1 className="font-display text-3xl italic text-ivory">Koleksi</h1>
        <p className="mt-2 text-sm text-muted">Semua konten dimuat dari API di folder /api.</p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl italic text-ivory">Playlist dari API</h2>
        {loading && <p className="text-sm text-muted">Memuat playlist...</p>}
        {!loading && playlists.length === 0 && <p className="text-sm text-muted">API belum mengembalikan playlist.</p>}
        {playlists.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl italic text-ivory">Lagu dari API</h2>
        <div className="rounded-2xl border border-line bg-surface/50 p-2">
          {loading && <p className="px-3 py-6 text-center text-sm text-muted">Memuat lagu...</p>}
          {!loading && tracks.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted">API belum mengembalikan lagu.</p>}
          {tracks.map((track, i) => <TrackRow key={track.id} track={track} index={i} queue={tracks} />)}
        </div>
      </section>
    </div>
  );
}
