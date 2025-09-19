"use client";

import Link from "next/link";
import { useMemo } from "react";

export const VideoCard = ({ video, layout }) => {
  const { snippet, statistics, contentDetails } = video;
  const videoId = video.id?.videoId || video.id; // ✅ siempre obtenemos el id real

  // 🔹 Formatear vistas
  const formatViews = (num) => {
    if (!num) return "Sin vistas";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1) + " M de visualizaciones";
    if (num >= 1_000)
      return (num / 1_000).toFixed(1) + " K de visualizaciones";
    return num + " visualizaciones";
  };

  // 🔹 Formatear tiempo
  const formatDate = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 1) return "hoy";
    if (days < 7) return `hace ${Math.floor(days)} días`;
    if (days < 30) return `hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `hace ${Math.floor(days / 30)} meses`;
    return `hace ${Math.floor(days / 365)} años`;
  };

  // 🔹 Duración ISO8601 → mm:ss
  const formatDuration = (iso) => {
    if (!iso) return "";
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "";
    const [, h, m, s] = match.map((v) => parseInt(v || 0));
    return `${h ? h + ":" : ""}${m || "0"}:${s.toString().padStart(2, "0")}`;
  };

  const views = useMemo(() => formatViews(statistics?.viewCount), [statistics]);
  const published = useMemo(
    () => formatDate(snippet?.publishedAt),
    [snippet]
  );
  const duration = useMemo(
    () => formatDuration(contentDetails?.duration),
    [contentDetails]
  );

  return (
    <Link href={`/video/${videoId}`} className="block">
      <div className="cursor-pointer transition-all duration-300">
        {/* Miniatura */}
        <div className="relative flex-shrink-0">
          <img
            src={snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.high?.url}
            alt={snippet?.title}
            className={`rounded-xl object-cover ${
              layout === "grid" ? "w-full aspect-video" : "w-64 h-36"
            }`}
          />
          {duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {duration}
            </span>
          )}
        </div>

        {/* Info */}
        <div className={layout === "grid" ? "mt-3" : "flex-1 pl-3"}>
          <div className="flex items-start gap-2">
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-1">
                {snippet?.title}
              </h3>
              <p className="text-xs text-gray-600 mb-1">{snippet?.channelTitle}</p>
              <p className="text-xs text-gray-600">
                {views} • {published}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};