import type { Track } from "@/types";
import Artwork from "./Artwork";
import { usePlayerStore } from "@/store/playerStore";

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function TrackRow({
  track,
  index,
  queue,
}: {
  track: Track;
  index: number;
  queue: Track[];
}) {
  const { current, isPlaying, playQueue, togglePlay } = usePlayerStore();
  const isCurrent = current()?.id === track.id;

  function handleClick() {
    if (isCurrent) {
      togglePlay();
    } else {
      playQueue(queue, index);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface2 ${
        isCurrent ? "bg-surface2" : ""
      }`}
    >
      <Artwork title={track.title} artworkUrl={track.artworkUrl} size={44} rounded="rounded-md" />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isCurrent ? "text-rose-light" : "text-ivory"}`}>
          {track.title}
        </p>
        <p className="truncate text-xs text-muted">{track.artist}</p>
      </div>
      {isCurrent && isPlaying ? (
        <div className="flex items-end gap-0.5 h-3.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-0.5 animate-pulse rounded-full bg-rose-light"
              style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      ) : (
        <span className="text-xs tabular-nums text-muted">{formatDuration(track.durationSec)}</span>
      )}
    </button>
  );
}
