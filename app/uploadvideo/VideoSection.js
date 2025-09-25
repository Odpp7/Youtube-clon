"use client";
import { useState, useEffect } from "react";
import { Filter, MoreVertical, Eye, MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import { supabase } from "../services/supabaseClient";

export const VideoSection = ({ isSidebarOpen }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener videos
  useEffect(() => {
    const fetchVideos = async () => {

      const { data: videosData, error } = await supabase
        .from('Videos')
        .select('*')

      if (error) {
        console.error('Error fetching videos:', error);
      } else {
        setVideos(videosData || []);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  return (
    <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'ml-16'} bg-white`}>
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Contenido del canal</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={16} />
              Filtrar
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 rounded-t-lg">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
            <div className="col-span-4">Video</div>
            <div className="col-span-2">Visibilidad</div>
            <div className="col-span-2">Restricciones</div>
            <div className="col-span-2">Fecha</div>
            <div>Acciones</div>
          </div>
        </div>

        {/* Lista de videos */}
        <div className="bg-white border border-gray-200 rounded-b-lg">
          {videos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No hay videos disponibles</p>
            </div>
          ) : (
            videos.map((video, index) => (
              <div key={video.id || index} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 items-center">
                
                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {video.URL ? (
                        <video src={video.URL} className="w-full h-full object-cover"/>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {video.Name || 'Sin título'}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {video.Description || 'Añadir descripción'}
                    </p>
                  </div>
                </div>

                {/* Visibilidad */}
                <div className="col-span-2 flex items-center gap-2">
                  <Eye size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {video.Visibilidad || 'Sin visibilidad'}
                    </p>
                </div>

                {/* Restricciones */}
                <div className="col-span-2">
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {video.Restricciones || 'Sin Restricciones'}
                    </p>
                </div>
                
                {/* Fecha */}
                <div className="col-span-2">
                    <div className="text-xs text-gray-600">
                        {new Date(video.Date).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        })}
                    </div>
                    <div className="text-xs text-gray-500">Publicado</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {videos.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Filas por página: 30
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">1-{videos.length} de {videos.length}</span>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded">‹</button>
                <button className="p-2 hover:bg-gray-100 rounded">›</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};