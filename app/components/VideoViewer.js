"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import getVideoDetails from "../services/getVideoDetails";
import { ThumbsUp, ThumbsDown, ArrowDownToLine, CornerUpRight, CircleDollarSign, Ellipsis } from "lucide-react";
import { VideoList } from "../components/VideoList";
import SearchVideo from "../services/SearchVideo";

export const VideoViewer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const searchParams = useSearchParams();
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
    if (id) {
      getVideoDetails(id).then(setVideo).catch((err) => {
        console.error("Error cargando video:", err);
      });
    }
  }, [id]);

  useEffect(() => {
    if (query) {
      SearchVideo(query).then(setVideos).catch(console.error);
    }
  }, [query]);

  const likes = useMemo(() => formatViews(video?.statistics?.likeCount));

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Cargando video...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-white flex">
      {/* Columna principal */} 
      <article className="flex-1 px-6 py-4">

        <section className="w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title="YouTube video player"
            className="w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </section>

        <h1 className="text-xl font-bold text-black mt-4">{video.snippet?.title}</h1>

        <section className="flex items-center gap-4 mt-4 rounded-lg">
          <img src={video.channelInfo.thumbnail} className="w-12 rounded-full"/>

          <div>
            <p className="font-bold text-black">{video.channelInfo.title}</p>
            <p className="text-gray-400 text-sm"> {parseInt(video.channelInfo.subs).toLocaleString()} suscriptores</p>
          </div>

          <button className="bg-[#F2F2F2] px-3 py-3 rounded-full font-[700] hover:bg-gray-200 text-black cursor-pointer text-[14px]">Unirme</button>
          <button className="bg-black px-4 py-2 rounded-full font-semibold hover:bg-gray-800 cursor-pointer">Suscribirme</button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center">
              <button className="bg-[#F2F2F2] px-3 py-3 rounded-l-full text-sm hover:bg-gray-200 text-black cursor-pointer text-[14px] flex items-center gap-2"><ThumbsUp/>{likes}</button>
              <button className="bg-[#F2F2F2] px-3 py-3 rounded-r-full hover:bg-gray-200 text-black cursor-pointer text-[14px]"><ThumbsDown/></button>
            </div>
              <button className="bg-[#F2F2F2] px-3 py-2 rounded-full text-sm hover:bg-gray-200 flex items-center gap-1 text-black cursor-pointer"><CornerUpRight/> Compartir</button>
              <button className="bg-[#F2F2F2] px-3 py-2 rounded-full text-sm hover:bg-gray-200 flex items-center gap-1 text-black cursor-pointer"><ArrowDownToLine/> Descargar</button>
              <button className="bg-[#F2F2F2] px-3 py-2 rounded-full text-sm hover:bg-gray-200 flex items-center gap-1 text-black cursor-pointer"><CircleDollarSign/> Gracias</button>
              <button className="bg-[#F2F2F2] px-3 py-2 rounded-full text-sm hover:bg-gray-200 text-black cursor-pointer"><Ellipsis/></button>
          </div>
        </section>

        <section className="bg-[#F2F2F2] py-3 px-3 rounded-xl mt-5">
          <div className="flex gap-4 text-sm">
            <p className="text-black font-[550]">{video.statistics?.viewCount} visualizaciones</p>
            <p className="text-black font-[550]">{formatDate(video.snippet?.publishedAt)}</p>
          </div>
          <p className="mt-2 text-black">{video.snippet?.description}</p>
        </section>

        <p className="text-black mt-8 font-bold text-[20px]"> {video.statistics?.commentCount} comentarios</p>

        {/* Comentarios */}
        <ul className="mt-4 space-y-5 text-black">
          {video.comments?.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <img src={c.authorProfileImageUrl} alt={c.author} className="w-10 rounded-full"/>

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-bold">{c.author}</span>{" "}
                  <span className="text-gray-500 text-xs">{formatDate(c.publishedAt)}</span>
                </p>

                <p className="text-sm">{c.text}</p>

                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-2"> <ThumbsUp size={16}/> {c.likes}</span>
                  <button><ThumbsDown size={16}/></button>
                  <button className="font-semibold cursor-pointer">Responder</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </article>

      {/* Columna lateral */}
      <aside className="w-96 p-4 hidden lg:block">
        <VideoList videos={videos} layout="list" isInSidebar={true} />
      </aside>
    </main>
  );
};
