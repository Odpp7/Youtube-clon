"use client";
import { useState, useEffect } from "react";
import { Filter, Eye, Trash, CircleFadingArrowUp } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { ModalVideo } from "./modalVideo";

export const VideoSection = ({ isSidebarOpen }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      setVideos([]);
      setLoading(false);
      return;
    }

    const { data: videosData, error } = await supabase
      .from("Videos")
      .select("*")
      .eq("user_id", user.id);

    if (error) console.error("Error fetching videos:", error);
    else setVideos(videosData || []);

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

  return (
    <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'ml-16'} bg-white`}>
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Contenido del canal</h1>
        </div>
      </div>

      <div className="p-2 md:p-6">
        <div className="hidden md:block bg-gray-50 px-4 py-3 rounded-t-lg">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
            <div className="col-span-4">Video</div>
            <div className="col-span-2">Visibilidad</div>
            <div className="col-span-2">Restricciones</div>
            <div className="col-span-2">Fecha</div>
            <div>Acciones</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg md:rounded-b-lg">
          {videos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No hay videos disponibles</p>
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="border-b last:border-b-0 hover:bg-gray-50 p-3 md:p-4">
                <div className="block md:hidden space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-24 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      {video.URL && <video src={video.URL} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{video.Name || "Sin título"}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.Description || "Añadir descripción"}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                      <Eye size={12} />
                      {video.Visibilidad || "Sin visibilidad"}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {video.Restricciones || "Sin restricción"}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
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
                    <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {video.URL && <video src={video.URL} className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm">{video.Name || "Sin título"}</h3>
                      <p className="text-xs text-gray-500">{video.Description || "Añadir descripción"}</p>
                    </div>
                  </div>

                  {/* Visibilidad */}
                  <div className="flex col-span-2 items-center gap-2 text-sm">
                    <Eye size={16} className="text-gray-400" />
                    <p>{video.Visibilidad || "Sin visibilidad"}</p>
                  </div>

                  {/* Restricciones */}
                  <div className="text-sm col-span-2">{video.Restricciones || "Sin restricción"}</div>

                  {/* Fecha */}
                  <div className="text-xs text-gray-600 col-span-2">
                    {new Date(video.Date).toLocaleDateString("es-CO")}
                  </div>

                  {/* Acciones */}
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
    </main>
  );
};