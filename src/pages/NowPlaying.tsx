import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import Artwork from "@/components/Artwork";
import { getLyrics } from "@/lib/api";

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function NowPlaying() {
  const navigate = useNavigate();
  const {
    isPlaying,
    progressSec,
    repeat,
    shuffle,
    togglePlay,
    next,
    prev,
    seek,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();
  const current = usePlayerStore((s) => s.current());

  if (!current) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 pb-6 text-center">
        <p className="text-sm text-muted">Belum ada yang diputar.</p>
        <button onClick={() => navigate("/")} className="text-sm text-rose-light">
          Cari sesuatu untuk didengar
        </button>
      </div>
    );
  }

  const [lyrics, setLyrics] = useState<{type: string; lines: {time:number;text:string}[]} | null>(null);
  useEffect(() => { let active = true; getLyrics(current.videoId || "").then((r) => active && setLyrics(r.lyrics)).catch(() => active && setLyrics(null)); return () => { active = false; }; }, [current.id]);

  const duration = current.durationSec || 1;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 pb-6 pt-4 text-center">
      <button onClick={() => navigate(-1)} className="self-start text-sm text-muted hover:text-ivory">
        ↓ Tutup
      </button>

      <Artwork title={current.title} artworkUrl={current.artworkUrl} size={280} rounded="rounded-3xl" className="w-full max-w-xs aspect-square shadow-glow" />

      <div>
        <h1 className="font-display text-2xl italic text-ivory">{current.title}</h1>
        <p className="text-sm text-muted">{current.artist}</p>
      </div>

      <div className="w-full">
        <input
          type="range"
          min={0}
          max={duration}
          value={Math.min(progressSec, duration)}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-rose"
        />
        <div className="flex justify-between text-xs text-muted">
          <span>{formatDuration(progressSec)}</span>
          <span>{formatDuration(current.durationSec)}</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={toggleShuffle}
          className={`p-2 ${shuffle ? "text-rose-light" : "text-muted"}`}
          aria-label="Acak"
        >
          <ShuffleIcon />
        </button>
        <button onClick={prev} className="p-2 text-ivory" aria-label="Sebelumnya">
          <PrevIcon />
        </button>
        <button
          onClick={togglePlay}
          className="rounded-full bg-gradient-to-br from-rose-light to-rose p-5 text-ink shadow-glow"
          aria-label={isPlaying ? "Jeda" : "Putar"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={next} className="p-2 text-ivory" aria-label="Berikutnya">
          <NextIcon />
        </button>
        <button
          onClick={toggleRepeat}
          className={`p-2 ${repeat !== "off" ? "text-rose-light" : "text-muted"}`}
          aria-label="Ulangi"
        >
          <RepeatIcon mode={repeat} />
        </button>
      </div>

      <section className="w-full rounded-2xl border border-line bg-surface/50 p-4 text-left">
        <h2 className="mb-3 font-display text-xl italic text-ivory">Lirik dari API</h2>
        {!lyrics || lyrics.type === "none" || lyrics.lines.length === 0 ? <p className="text-sm text-muted">Lirik tidak tersedia dari endpoint /api/lyrics.</p> : <div className="max-h-72 space-y-2 overflow-y-auto text-sm text-muted">{lyrics.lines.map((line, i) => <p key={`${line.time}-${i}`}>{line.text}</p>)}</div>}
      </section>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zM20 6L10 12l10 6z" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6h2v12h-2zM4 6l10 6-10 6z" />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h3.5L16 18h4M4 18h3.5L11 13M20 6h-4l-2 2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 4l2 2-2 2M18 16l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RepeatIcon({ mode }: { mode: "off" | "all" | "one" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 22l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
      {mode === "one" && <text x="10.5" y="14.5" fontSize="7" fill="currentColor" stroke="none">1</text>}
    </svg>
  );
}
