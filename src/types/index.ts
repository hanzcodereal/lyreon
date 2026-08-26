export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  artworkUrl?: string;
  durationSec: number;
  source: "api";
  videoId?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  trackIds: string[];
}

export interface Artist {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface EditorialSection {
  id: string;
  title: string;
  subtitle?: string;
  playlists: Playlist[];
}

export type RepeatMode = "off" | "all" | "one";
