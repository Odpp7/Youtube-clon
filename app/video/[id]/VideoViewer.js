"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import getVideoDetails from "../../services/getVideoDetails";
import { ThumbsUp, ThumbsDown, ArrowDownToLine, CornerUpRight, CircleDollarSign, Ellipsis } from "lucide-react";
import { VideoList } from "../../components/VideoList";
import SearchVideo from "../../services/SearchVideo";
import { supabase } from "../../services/supabaseClient";

export const VideoViewer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const query = searchParams.get("q");

  const formatViews = (num) => {
    if (!num) return "Sin vistas";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1) + " M";
    if (num >= 1_000)
      return (num / 1_000).toFixed(1) + " K";
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

  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;

      if (type === "supabase") {
        const { data, error } = await supabase.from("Videos").select("*").eq("id", id).single();
        if (error) console.error("Error cargando video Supabase:", error);
        else setVideo(data);
      } else {
        try {
          const ytVideo = await getVideoDetails(id);
          setVideo(ytVideo);
        } catch (err) {
          console.error("Error cargando video YouTube:", err);
        }
      }
    };

    loadVideo();
  }, [id, type]);

  useEffect(() => {
    if (query) {
      SearchVideo(query).then(setVideos).catch(console.error);
    }
  }, [query]);

  const likes = useMemo(() => formatViews(video?.statistics?.likeCount));
  const isSupabase = type === "supabase";

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Cargando video...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-white flex flex-col lg:flex-row">
      {/* Columna principal */}
      <article className="flex-1 p-2 md:py-4">
        {/* Video player */}
        <section className="w-full aspect-video">
          {isSupabase ? (
            <video
              src={video.URL}
              controls
              autoPlay
              className="w-full h-full rounded-lg md:rounded-xl object-cover"
            />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
              title="YouTube video player"
              className="w-full h-full rounded-lg md:rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </section>

        <h1 className="text-lg md:text-xl font-bold text-black mt-3 md:mt-4 px-2 md:px-0">
          {isSupabase ? video.Name : video.snippet?.title}
        </h1>

        {/* YouTube content */}
        {!isSupabase && (
          <>
            <section className="flex flex-col md:flex-row md:items-center md:space-x-65 gap-3 md:gap-4 mt-3 md:mt-4 px-2 md:px-0">
              <div className="flex items-center gap-3">
                <img src={video.channelInfo.thumbnail} className="w-10 md:w-12 rounded-full"/>
                <div>
                  <p className="font-bold text-black text-sm md:text-base">{video.channelInfo.title}</p>
                  <p className="text-gray-400 text-xs md:text-sm">
                    {parseInt(video.channelInfo.subs).toLocaleString()} suscriptores
                  </p>
                </div>
                <button className="bg-[#F2F2F2] px-3 py-2 rounded-full font-[700] hover:bg-gray-200 text-black cursor-pointer text-xs md:text-[14px] ml-auto md:ml-0">
                  Unirme
                </button>
                <button className="bg-black px-4 py-2 rounded-full font-semibold hover:bg-gray-800 cursor-pointer text-sm md:text-base md:text-[14px] ml-auto md:ml-0">
                  Suscribirme
                </button>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 px-2 md:px-0 items-center">
                <div className="flex items-center">
                  <button className="bg-[#F2F2F2] px-2 md:px-3 py-2 md:py-3 rounded-l-full text-xs md:text-sm hover:bg-gray-200 text-black cursor-pointer flex items-center gap-1 md:gap-2">
                    <ThumbsUp size={14} className="md:w-5 md:h-5"/>{likes}
                  </button>
                  <button className="bg-[#F2F2F2] px-2 md:px-3 py-2 md:py-3 rounded-r-full hover:bg-gray-200 text-black cursor-pointer">
                    <ThumbsDown size={14} className="md:w-5 md:h-5"/>
                  </button>
                </div>
                <button className="bg-[#F2F2F2] px-2 md:px-3 py-2 text-xs md:text-sm rounded-full hover:bg-gray-200 flex items-center gap-1 text-black cursor-pointer">
                  <CornerUpRight size={14} className="md:w-5 md:h-5"/> Compartir
                </button>
                <button className="bg-[#F2F2F2] px-2 md:px-3 py-2 text-xs md:text-sm rounded-full hover:bg-gray-200 flex items-center gap-1 text-black cursor-pointer">
                  <ArrowDownToLine size={14} className="md:w-5 md:h-5"/> Descargar
                </button>
                <button className="hidden md:flex bg-[#F2F2F2] px-3 py-2 text-sm rounded-full hover:bg-gray-200 items-center gap-1 text-black cursor-pointer">
                  <CircleDollarSign/> Gracias
                </button>
                <button className="bg-[#F2F2F2] px-2 md:px-3 py-2 text-sm rounded-full hover:bg-gray-200 text-black cursor-pointer">
                  <Ellipsis size={14} className="md:w-5 md:h-5"/>
                </button>
              </div>
            </section>

            {/* Botones de acción - responsive */}

            <section className="bg-[#F2F2F2] py-3 px-3 rounded-xl mt-4 md:mt-5 mx-2 md:mx-0">
              <div className="flex gap-4 text-xs md:text-sm">
                <p className="text-black font-[550]">{video.statistics?.viewCount} visualizaciones</p>
                <p className="text-black font-[550]">{formatDate(video.snippet?.publishedAt)}</p>
              </div>
              <p className="mt-2 text-black text-sm md:text-base line-clamp-3 md:line-clamp-none">{video.snippet?.description}</p>
            </section>

            <p className="text-black mt-6 md:mt-8 font-bold text-lg md:text-[20px] px-2 md:px-0"> 
              {video.statistics?.commentCount} comentarios
            </p>

            {/* Comentarios */}
            <ul className="mt-4 space-y-4 md:space-y-5 text-black px-2 md:px-0">
              {video.comments?.map((c, i) => (
                <li key={i} className="flex items-start gap-2 md:gap-3">
                  <img src={c.authorProfileImageUrl} alt={c.author} className="w-8 md:w-10 rounded-full flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm">
                      <span className="font-bold">{c.author}</span>{" "}
                      <span className="text-gray-500 text-xs">{formatDate(c.publishedAt)}</span>
                    </p>
                    <p className="text-xs md:text-sm mt-1">{c.text}</p>
                    <div className="flex items-center gap-3 md:gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1 md:gap-2"> 
                        <ThumbsUp size={12} className="md:w-4 md:h-4"/> {c.likes}
                      </span>
                      <button><ThumbsDown size={12} className="md:w-4 md:h-4"/></button>
                      <button className="font-semibold cursor-pointer">Responder</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Supabase content */}
        {isSupabase && (
          <section className="bg-[#F2F2F2] py-3 px-3 rounded-xl mt-4 md:mt-5 mx-2 md:mx-0">
            <div className="flex gap-4 text-xs md:text-sm">
              <p className="text-black font-[550]">Publicado el {formatDate(video.created_at)}</p>
            </div>
            <p className="mt-2 text-black text-sm md:text-base">{video.Description || "Sin descripción"}</p>
          </section>
        )}

        {/* Videos relacionados en móvil */}
        <div className="lg:hidden mt-6">
          <h3 className="text-black font-bold text-lg px-2 mb-4">Videos relacionados</h3>
          <VideoList videos={videos} layout="list" isInSidebar={true} />
        </div>
      </article>

      {/* Columna lateral - solo desktop */}
      <aside className="w-150 hidden lg:block">
        <VideoList videos={videos} layout="list" isInSidebar={true} />
      </aside>
    </main>
  );
};