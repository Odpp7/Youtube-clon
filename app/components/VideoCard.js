"use client";

import { useMemo } from "react";

export const VideoCard = ({ video, layout, isSidebarOpen }) => {
  const { snippet, statistics, contentDetails, channelThumbnail } = video;

  // 🔹 Formatear vistas
  const formatViews = (num) => {
    if (!num) return "Sin vistas";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + " M de visualizaciones";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + " K de visualizaciones";
    return num + " visualizaciones";
  };

  // 🔹 Formatear tiempo de publicación
  const formatDate = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 1) return "hoy";
    if (days < 7) return `hace ${Math.floor(days)} días`;
    if (days < 30) return `hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `hace ${Math.floor(days / 30)} meses`;
    return `hace ${Math.floor(days / 365)} años`;
  };

  // 🔹 Formatear duración (ISO8601 → 3:39)
  const formatDuration = (iso) => {
    if (!iso) return "";
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "";
    const [, h, m, s] = match.map((v) => parseInt(v || 0));
    return `${h ? h + ":" : ""}${m || "0"}:${s.toString().padStart(2, "0")}`;
  };

  const views = useMemo(() => formatViews(statistics?.viewCount), [statistics]);
  const published = useMemo(() => formatDate(snippet?.publishedAt), [snippet]);
  const duration = useMemo(() => formatDuration(contentDetails?.duration), [contentDetails]);

  return (
    <div className={`cursor-pointer transition-all duration-300`}>
      {/* Miniatura */}
      <div className="relative flex-shrink-0">
        <img src={snippet?.thumbnails?.medium?.url} className={`rounded-xl object-cover ${ layout === "grid" ? "w-full" : "w-64 h-36"}`}/>
        {duration && ( <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded"> {duration} </span>)}
      </div>

      {/* Info */}
      <div className={layout === "grid" ? "mt-2" : "flex-1 pl-3"}>
        <div className="flex items-start gap-2">
          {channelThumbnail && ( <img src={channelThumbnail}className="w-9 h-9 rounded-full"/> )}

          {/* Título y metadatos */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold line-clamp-2 leading-snug"> {snippet?.title}</h3>
            <p className="text-xs text-gray-600">{snippet?.channelTitle}</p>
            <p className="text-xs text-gray-600">{views} • {published}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
