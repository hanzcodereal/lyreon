import { Routes, Route } from "react-router-dom";
import { Sidebar, BottomNav } from "@/components/NavShell";
import MiniPlayer from "@/components/MiniPlayer";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import PlaylistDetail from "@/pages/PlaylistDetail";
import NowPlaying from "@/pages/NowPlaying";
import Settings from "@/pages/Settings";
import Artist from "@/pages/Artist";

export default function App() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="min-h-screen px-4 pb-28 pt-6 sm:ml-64 sm:px-8 sm:pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/now-playing" element={<NowPlaying />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
