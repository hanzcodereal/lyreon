import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePlayerStore } from "@/store/playerStore";
import { playSong } from "@/lib/api";
import Artwork from "./Artwork";

export default function MiniPlayer() {
  const { queue, isPlaying, progressSec, volume, togglePlay, next, prev, setProgress } = usePlayerStore();
  const current = usePlayerStore((s) => s.current());
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setAudioUrl(undefined);
    setError("");
    if (!current) return;

    playSong(current)
      .then(({ audioUrl, durationSec }) => {
        if (cancelled) return;
        setAudioUrl(audioUrl);
        if (durationSec > 0 && current.durationSec <= 0) {
          current.durationSec = durationSec;
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat audio dari API play");
      });

    return () => { cancelled = true; };
  }, [current?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.src = audioUrl;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [audioUrl, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && audioUrl) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(progressSec)) return;
    if (Math.abs(audio.currentTime - progressSec) > 1.5) audio.currentTime = progressSec;
  }, [progressSec]);

  if (!current || queue.length === 0) return null;

  const duration = current.durationSec || audioRef.current?.duration || 0;
  const pct = duration ? Math.min(100, (progressSec / duration) * 100) : 0;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 mx-2 rounded-2xl border border-line bg-surface/95 backdrop-blur sm:bottom-3 sm:mx-4 sm:left-64">
      <audio ref={audioRef} onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)} onEnded={() => next()} />
      <div className="h-0.5 w-full overflow-hidden rounded-t-2xl bg-line">
        <div className="h-full bg-gradient-to-r from-rose to-rose-light" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <Link to="/now-playing" className="flex min-w-0 flex-1 items-center gap-3">
          <Artwork title={current.title} artworkUrl={current.artworkUrl} size={40} rounded="rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ivory">{current.title}</p>
            <p className="truncate text-xs text-muted">{error || current.artist}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <button aria-label="Sebelumnya" onClick={prev} className="rounded-full p-2 text-muted hover:text-ivory"><PrevIcon /></button>
          <button aria-label={isPlaying ? "Jeda" : "Putar"} onClick={togglePlay} className="rounded-full bg-gradient-to-br from-rose-light to-rose p-2.5 text-ink shadow-glow">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button aria-label="Berikutnya" onClick={next} className="rounded-full p-2 text-muted hover:text-ivory"><NextIcon /></button>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>; }
function PauseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>; }
function PrevIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM20 6L10 12l10 6z" /></svg>; }
function NextIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM4 6l10 6-10 6z" /></svg>; }
