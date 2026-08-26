interface ArtworkProps {
  title: string;
  artworkUrl?: string;
  size?: number;
  rounded?: string;
  className?: string;
}

const PALETTE = ["#e11d5e", "#7a1638", "#f4c874", "#3d1420", "#c2185b"];

function hashHue(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % PALETTE.length;
  return PALETTE[h];
}

export default function Artwork({ title, artworkUrl, size = 56, rounded = "rounded-xl", className = "" }: ArtworkProps) {
  const c1 = hashHue(title);
  const c2 = hashHue(title.split("").reverse().join(""));
  return (
    <div
      className={`flex items-center justify-center shrink-0 overflow-hidden ${rounded} ${className}`}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${c1}, ${c2})` }}
    >
      {artworkUrl ? (
        <img src={artworkUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className="font-display text-ivory/90" style={{ fontSize: size * 0.36 }}>
          {title.trim().charAt(0).toUpperCase() || "L"}
        </span>
      )}
    </div>
  );
}
