import { useEffect, useState } from "react";
import type { Playlist, Track } from "@/types";
import { searchAll, getSuggestions } from "@/lib/api";
import TrackRow from "@/components/TrackRow";
import PlaylistCard from "@/components/PlaylistCard";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{songs: Track[]; playlists: Playlist[]; artists: {id:string; name:string; thumbnail?:string}[]}>({songs:[],playlists:[],artists:[]});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const t = setTimeout(async () => {
      if (!query.trim()) { setResults({songs:[],playlists:[],artists:[]}); setSuggestions([]); setLoading(false); return; }
      setLoading(true);
      try {
        const [all, suggest] = await Promise.all([searchAll(query), getSuggestions(query)]);
        if (active) { setResults(all); setSuggestions(suggest.slice(0, 6)); }
      } catch { if (active) { setResults({songs:[],playlists:[],artists:[]}); setSuggestions([]); } }
      finally { if (active) setLoading(false); }
    }, 250);
    return () => { active = false; clearTimeout(t); };
  }, [query]);

  return <div className="space-y-5 pb-6">
    <h1 className="font-display text-3xl italic text-ivory">Cari</h1>
    <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Judul lagu, artis, atau album" className="w-full rounded-full border border-line bg-surface2 px-5 py-3 text-sm text-ivory placeholder:text-muted focus:border-rose focus:outline-none" />
    {query && suggestions.length > 0 && !loading && <div className="flex flex-wrap gap-2">{suggestions.map(s=><button key={s} onClick={()=>setQuery(s)} className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ivory">{s}</button>)}</div>}
    {results.artists.length > 0 && <section><h2 className="mb-3 font-display text-xl italic text-ivory">Artis</h2><div className="flex flex-wrap gap-2">{results.artists.map(a=><Link key={a.id} to={`/artist/${a.id}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ivory hover:border-rose">{a.name}</Link>)}</div></section>}
    {results.playlists.length > 0 && <section><h2 className="mb-3 font-display text-xl italic text-ivory">Playlist</h2><div className="flex gap-4 overflow-x-auto pb-2">{results.playlists.map(p=><PlaylistCard key={p.id} playlist={p}/>)}</div></section>}
    <section><h2 className="mb-3 font-display text-xl italic text-ivory">Lagu</h2><div className="rounded-2xl border border-line bg-surface/50 p-2 min-h-[120px]">{loading && <p className="px-3 py-4 text-sm text-muted">Mencari lewat API...</p>}{!loading && query && results.songs.length===0 && <p className="px-3 py-4 text-sm text-muted">Tidak ada hasil dari API.</p>}{!query && <p className="px-3 py-4 text-sm text-muted">Masukkan kata kunci untuk mencari melalui API.</p>}{results.songs.map((t,i)=><TrackRow key={t.id} track={t} index={i} queue={results.songs}/>)}</div></section>
  </div>;
}
