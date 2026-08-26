import { Link } from "react-router-dom";
import type { Playlist } from "@/types";
import Artwork from "./Artwork";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link to={`/playlist/${playlist.id}`} className="group w-36 shrink-0 sm:w-40">
      <Artwork title={playlist.title} artworkUrl={playlist.coverUrl} size={144} rounded="rounded-2xl" className="w-full aspect-square shadow-glow" />
      <p className="mt-2 truncate text-sm font-medium text-ivory group-hover:text-rose-light">{playlist.title}</p>
      {playlist.description && <p className="truncate text-xs text-muted">{playlist.description}</p>}
    </Link>
  );
}
