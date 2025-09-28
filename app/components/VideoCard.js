"use client";

import Link from "next/link";
import { useMemo } from "react";

export const VideoCard = ({ video, layout }) => {
  const isSupabaseVideo = !video?.snippet && (video?.URL || video?.Name || video?.ThumbnailURL);

  const snippet = isSupabaseVideo
    ? {
        title: video?.Name || "Sin título",
        description: video?.Description || "",
        publishedAt: video?.Date || video?.created_at || new Date().toISOString(),
        thumbnails: {
          medium: { url: video?.ThumbnailURL || null },
          high: { url: video?.ThumbnailURL || null },
        },
        channelTitle: video?.channelTitle || video?.Channel || "Mi canal",
      }
    : (video?.snippet || {});

  const statistics = isSupabaseVideo
    ? { viewCount: video?.Views || video?.viewCount || 0 }
    : (video?.statistics || {});

  const contentDetails = isSupabaseVideo
    ? { duration: video?.DurationISO || video?.duration || null }
    : (video?.contentDetails || {});

  // 🔥 MOVER videoId ANTES de usarlo
  const videoId = isSupabaseVideo
    ? (typeof video?.id !== "undefined" ? video.id : `supabase-${Math.random().toString(36).slice(2, 9)}`)
    : (video?.id?.videoId || video?.id);

  // 🔥 AHORA videoUrl puede usar videoId
  const videoUrl = isSupabaseVideo 
    ? `/video/${videoId}?type=supabase&q=${encodeURIComponent(snippet?.title || "")}`
    : `/video/${videoId}?q=${encodeURIComponent(snippet?.title || "")}`;

  const formatViews = (num) => {
    if (!num) return "Sin vistas";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + " M de visualizaciones";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + " K de visualizaciones";
    return num + " visualizaciones";
  };

  const formatDate = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 1) return "hoy";
    if (days < 7) return `hace ${Math.floor(days)} días`;
    if (days < 30) return `hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `hace ${Math.floor(days / 30)} meses`;
    return `hace ${Math.floor(days / 365)} años`;
  };

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

  const thumbnailUrl = snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.high?.url || null;

  if (layout === "list") {
    return (
      <Link href={videoUrl} className="block">
        <div className="flex gap-3 hover:bg-gray-50 rounded cursor-pointer transition-colors">
          <div className="relative flex-shrink-0">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} className="w-40 h-24 object-cover rounded"/>
            ) : isSupabaseVideo && video?.URL ? (
              <video src={video.URL} className="w-40 h-24 object-cover rounded"/>
            ) : (
              <div className="w-40 h-24 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                Sin miniatura
              </div>
            )}

            {duration && (
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                {duration}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1 text-black leading-tight"> {snippet?.title}</h3>
            <p className="text-xs text-gray-600 mb-1">{snippet?.channelTitle}</p>
            <p className="text-xs text-gray-500"> {statistics?.viewCount ? `${parseInt(statistics.viewCount).toLocaleString()} vistas` : 'Sin datos'} • {published}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={videoUrl} className="block">
      <div className="cursor-pointer transition-all duration-300">
        <div className="relative flex-shrink-0">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} className={`rounded-xl object-cover ${layout === "grid" ? "w-full aspect-video" : "w-64 h-36"}`}/>
          ) : isSupabaseVideo && video?.URL ? (
            <video src={video.URL} className={`rounded-xl object-cover ${layout === "grid" ? "w-full aspect-video" : "w-64 h-36"}`}/>
          ) : (
            <div className={`rounded-xl bg-gray-200 ${layout === "grid" ? "w-full aspect-video" : "w-64 h-36"} flex items-center justify-center text-gray-500`}> Sin miniatura</div>
          )}

          {duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded"> {duration}</span>
          )}
        </div>

        {/* Info */}
        <div className={layout === "grid" ? "mt-3" : "flex-1 pl-3"}>
          <div className="flex items-start gap-2">
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-1">{snippet?.title}</h3>
              <p className="text-xs text-gray-600 mb-1">{snippet?.channelTitle}</p>
              <p className="text-xs text-gray-600"> {views} • {published}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};