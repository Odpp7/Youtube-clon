"use client";
import { useState, useEffect } from "react";
import { Eye, Trash, CircleFadingArrowUp, X } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { ModalVideo } from "./modalVideo";

export const VideoSection = ({ isSidebarOpen, filteredVideos, searchTerm, onVideosLoaded }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      setVideos([]);
      setLoading(false);
      if (onVideosLoaded) onVideosLoaded([]);
      return;
    }

    const { data: videosData, error } = await supabase
      .from("Videos")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
      if (onVideosLoaded) onVideosLoaded([]);
    } else {
      setVideos(videosData || []);
      if (onVideosLoaded) onVideosLoaded(videosData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas borrar este video?")) return;
    const { error } = await supabase.from("Videos").delete().eq("id", id);
    if (error) {
      console.error("Error borrando video:", error);
      alert("Error al borrar video");
    } else {
      alert("Video eliminado ✅");
      fetchVideos();
    }
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
    fetchVideos();
  };

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
  };

  const handleClosePlayer = () => {
    setPlayingVideo(null);
  };

  const videosToShow = filteredVideos !== null ? filteredVideos : videos;

  return (
    <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'ml-16'} bg-custom`}>
      <div className="bg-custom border-b border-custom-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-custom">
            {searchTerm ? `Resultados de "${searchTerm}"` : 'Contenido del canal'}
          </h1>
        </div>
        {searchTerm && (
          <p className="text-sm text-custom-gray-600">
            {videosToShow.length} video{videosToShow.length !== 1 ? 's' : ''} encontrado{videosToShow.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="p-2 md:p-6">
        <div className="hidden md:block bg-custom-gray-50 px-4 py-3 rounded-t-lg">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-custom-gray-600">
            <div className="col-span-4">Video</div>
            <div className="col-span-2">Visibilidad</div>
            <div className="col-span-2">Restricciones</div>
            <div className="col-span-2">Fecha</div>
            <div>Acciones</div>
          </div>
        </div>

        <div className="bg-custom border border-custom-gray-200 rounded-lg md:rounded-b-lg">
          {videosToShow.length === 0 ? (
            <div className="p-8 text-center text-custom-gray-500">
              <p>{searchTerm ? 'No se encontraron videos con ese término' : 'No hay videos disponibles'}</p>
            </div>
          ) : (
            videosToShow.map((video) => (
              <div key={video.id} className="border-b border-custom-gray-200 last:border-b-0 hover:bg-custom-gray-50 p-3 md:p-4">
                <div className="block md:hidden space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-24 h-16 flex-shrink-0 bg-custom-gray-200 rounded-lg overflow-hidden cursor-pointer" onClick={() => handlePlayVideo(video)}>
                      {video.URL && <video src={video.URL} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-custom text-sm line-clamp-2">{video.Name || "Sin título"}</h3>
                      <p className="text-xs text-custom-gray-500 mt-1 line-clamp-2">{video.Description || "Añadir descripción"}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-custom-gray-100 px-2 py-1 rounded-full flex items-center gap-1 text-custom">
                      <Eye size={12} />
                      {video.Visibilidad || "Sin visibilidad"}
                    </span>
                    <span className="bg-custom-gray-100 px-2 py-1 rounded-full text-custom">
                      {video.Restricciones || "Sin restricción"}
                    </span>
                    <span className="bg-custom-gray-100 px-2 py-1 rounded-full text-custom">
                      {new Date(video.Date).toLocaleDateString("es-CO")}
                    </span>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleEdit(video)} className="text-blue-600 hover:text-blue-800 p-1">
                      <CircleFadingArrowUp size={18} />
                    </button>
                    <button onClick={() => handleDelete(video.id)} className="text-red-600 hover:text-red-800 p-1">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                  <div className="flex col-span-4 items-center gap-3">
                    <div className="w-32 h-20 bg-custom-gray-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => handlePlayVideo(video)}>
                      {video.URL && <video src={video.URL} className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-custom text-sm">{video.Name || "Sin título"}</h3>
                      <p className="text-xs text-custom-gray-500">{video.Description || "Añadir descripción"}</p>
                    </div>
                  </div>

                  <div className="flex col-span-2 items-center gap-2 text-sm text-custom">
                    <Eye size={16} className="text-custom-gray-400" />
                    <p>{video.Visibilidad || "Sin visibilidad"}</p>
                  </div>

                  <div className="text-sm col-span-2 text-custom">{video.Restricciones || "Sin restricción"}</div>

                  <div className="text-xs text-custom-gray-600 col-span-2">
                    {new Date(video.Date).toLocaleDateString("es-CO")}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(video)} className="text-blue-600 hover:text-blue-800">
                      <CircleFadingArrowUp />
                    </button>
                    <button onClick={() => handleDelete(video.id)} className="text-red-600 hover:text-red-800">
                      <Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <ModalVideo onClose={handleCloseModal} video={selectedVideo} />
      )}

      {playingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button onClick={handleClosePlayer} className="absolute -top-10 right-0 text-white hover:text-gray-300 cursor-pointer">
              <X size={32} />
            </button>
            <div className="bg-black rounded-lg overflow-hidden">
              <video src={playingVideo.URL} controls autoPlay className="w-full h-auto max-h-[80vh]"/>
              <div className="p-4 text-white">
                <h3 className="text-lg font-semibold">{playingVideo.Name}</h3>
                <p className="text-sm text-gray-300 mt-2">{playingVideo.Description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};