import type { Playlist, Track } from "@/types";

type ApiSong = {
  videoId: string;
  title: string;
  artist?: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  thumbnail?: string;
  thumbnails?: Array<{ url: string }>;
  duration?: string;
};

type ApiPlaylist = {
  id: string;
  title: string;
  artist?: string;
  cover?: string;
};

type SearchResponse = {
  status: boolean;
  result?: { songs?: ApiSong[]; playlists?: ApiPlaylist[] };
  message?: string;
};

type AlbumResponse = {
  status: boolean;
  result?: {
    id: string;
    title: string;
    description?: string;
    thumbnails?: Array<{ url: string }>;
    songs?: ApiSong[];
  };
  message?: string;
};

type PlayResponse = {
  status: boolean;
  result?: { download?: { audio?: string; duration?: string } };
  message?: string;
};

function durationFromApi(value?: string): number {
  if (!value) return 0;
  const text = String(value).trim();
  const clock = text.match(/^(\d+):([0-5]?\d)$/);
  if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
  const decimal = text.match(/^(\d+)\.(\d+)$/);
  if (decimal) return Number(decimal[1]) * 60 + Number(decimal[2]);
  const min = text.match(/(\d+)\s*(?:menit|min)/i);
  const sec = text.match(/(\d+)\s*(?:detik|det|sec|s)/i);
  return min ? Number(min[1]) * 60 + (sec ? Number(sec[1]) : 0) : 0;
}

function songToTrack(song: ApiSong): Track {
  return {
    id: `yt-${song.videoId}`,
    title: song.title || "Tanpa judul",
    artist: song.artist || "Unknown Artist",
    artistId: song.artistId,
    album: song.album,
    albumId: song.albumId,
    artworkUrl: song.thumbnail || song.thumbnails?.[song.thumbnails.length - 1]?.url,
    durationSec: durationFromApi(song.duration),
    source: "api",
    videoId: song.videoId,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const data = await response.json();
  if (!response.ok || data?.status === false) {
    throw new Error(data?.message || `API error ${response.status}`);
  }
  return data;
}

export interface ApiArtist { id: string; name: string; thumbnail?: string }
export interface LyricsLine { time: number; text: string }
export interface LyricsResult { videoId: string; title: string; artist: string; album: string; lyrics: { type: "none" | "plain" | "synced"; lines: LyricsLine[] } }

export async function getSuggestions(query: string): Promise<string[]> {
  const q = query.trim();
  if (!q) return [];
  const data = await request<string[]>(`/api/suggest?q=${encodeURIComponent(q)}`);
  return Array.isArray(data) ? data : [];
}

export async function searchAll(query: string): Promise<{ songs: Track[]; playlists: Playlist[]; artists: ApiArtist[] }> {
  const q = query.trim();
  if (!q) return { songs: [], playlists: [], artists: [] };
  const data = await request<SearchResponse & { result?: SearchResponse["result"] & { artists?: Array<{ browseId?: string; artistId?: string; name?: string; title?: string; thumbnail?: string; thumbnails?: Array<{url:string}> }> } }>(`/api/search?query=${encodeURIComponent(q)}`);
  const result = data.result || {};
  return {
    songs: (result.songs || []).map(songToTrack),
    playlists: (result.playlists || []).map((playlist) => ({ id: playlist.id, title: playlist.title || "Playlist tanpa judul", description: playlist.artist, coverUrl: playlist.cover, trackIds: [] })),
    artists: (result.artists || []).map((artist) => ({ id: artist.browseId || artist.artistId || "", name: artist.name || artist.title || "Unknown Artist", thumbnail: artist.thumbnail || artist.thumbnails?.[artist.thumbnails.length - 1]?.url })).filter((artist) => artist.id),
  };
}

export async function getArtist(id: string) {
  const data = await request<{ status: boolean; result?: any }>(`/api/artist?id=${encodeURIComponent(id)}`);
  if (!data.result) throw new Error("Data artis tidak tersedia dari API.");
  const r = data.result;
  return {
    id: r.artistId,
    name: r.name || "Unknown Artist",
    artworkUrl: r.thumbnails?.[r.thumbnails.length - 1]?.url,
    topSongs: (r.topSongs || []).map((song: ApiSong) => songToTrack(song)),
    topAlbums: r.topAlbums || [],
    topSingles: r.topSingles || [],
    similarArtists: r.similarArtists || [],
  };
}

export async function getLyrics(videoId: string): Promise<LyricsResult> {
  const data = await request<{ status: boolean; result?: LyricsResult }>(`/api/lyrics?id=${encodeURIComponent(videoId)}`);
  if (!data.result) throw new Error("Lirik tidak tersedia dari API.");
  return data.result;
}

export async function searchSongs(query: string): Promise<Track[]> {
  const q = query.trim();
  if (!q) return [];
  const data = await request<SearchResponse>(`/api/search?query=${encodeURIComponent(q)}&type=songs`);
  return (data.result?.songs || []).map(songToTrack);
}

export async function searchPlaylists(query: string): Promise<Playlist[]> {
  const q = query.trim();
  if (!q) return [];
  const data = await request<SearchResponse>(`/api/search?query=${encodeURIComponent(q)}&type=playlists`);
  return (data.result?.playlists || []).map((playlist) => ({
    id: playlist.id,
    title: playlist.title || "Playlist tanpa judul",
    description: playlist.artist,
    coverUrl: playlist.cover,
    trackIds: [],
  }));
}

export async function getPlaylist(id: string): Promise<{ playlist: Playlist; tracks: Track[] }> {
  const data = await request<AlbumResponse>(`/api/album?id=${encodeURIComponent(id)}`);
  const result = data.result;
  if (!result) throw new Error("Data playlist tidak tersedia dari API.");

  const playlist: Playlist = {
    id: result.id,
    title: result.title || "Playlist tanpa judul",
    description: result.description,
    coverUrl: result.thumbnails?.[result.thumbnails.length - 1]?.url,
    trackIds: (result.songs || []).map((song) => `yt-${song.videoId}`),
  };

  return { playlist, tracks: (result.songs || []).map(songToTrack) };
}

export async function playSong(track: Track): Promise<{ audioUrl: string; durationSec: number }> {
  if (!track.videoId) throw new Error("Video ID tidak tersedia.");
  const data = await request<PlayResponse>("/api/ytplay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: track.videoId }),
  });
  const audioUrl = data.result?.download?.audio;
  if (!audioUrl) throw new Error("Audio tidak tersedia dari API play.");
  return { audioUrl, durationSec: durationFromApi(data.result?.download?.duration) };
}
