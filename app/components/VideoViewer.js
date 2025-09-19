"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import getVideoDetails from "../services/getVideoDetails";

export const VideoViewer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (id) {
      getVideoDetails(id).then(setVideo).catch((err) => {
        console.error("Error cargando video:", err);
      });
    }
  }, [id]);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Cargando video...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex">
      {/* Columna principal */}
      <div className="flex-1 px-6 py-4">
        {/* Reproductor */}
        <div className="w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title="YouTube video player"
            className="w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Datos del video */}
        <h1 className="text-xl font-bold mt-4">{video.snippet?.title}</h1>
        <p className="text-gray-600">{video.snippet?.channelTitle}</p>
        <p className="mt-2">{video.snippet?.description}</p>

        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>👁️ {video.statistics?.viewCount} vistas</span>
          <span>👍 {video.statistics?.likeCount} likes</span>
          <span>💬 {video.statistics?.commentCount} comentarios</span>
        </div>

        {/* Comentarios */}
        <h2 className="mt-6 font-semibold">Comentarios</h2>
        <ul className="mt-2 space-y-3">
          {video.comments?.map((c, i) => (
            <li key={i} className="border-b pb-2">
              <p className="text-sm">
                <span className="font-bold">{c.author}</span>: {c.text}
              </p>
              <p className="text-xs text-gray-400">
                👍 {c.likes} • {new Date(c.publishedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Columna lateral */}
      <aside className="w-96 p-4 hidden lg:block">
        <h2 className="font-semibold mb-3">Videos recomendados</h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <img
              src="https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg"
              alt="thumb"
              className="w-40 h-24 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-semibold line-clamp-2">
                Desafío del Siglo XXI - En Vivo
              </p>
              <p className="text-xs text-gray-400">El Desafío</p>
              <p className="text-xs text-gray-400">26K usuarios</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
