"use client";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { HardDriveDownload } from "lucide-react";

export const ModalVideo = ({ onClose, video }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(video?.Name || "");
  const [description, setDescription] = useState(video?.Description || "");
  const [visibilidad, setVisibilidad] = useState(video?.Visibilidad || "");
  const [restricciones, setRestricciones] = useState(video?.Restricciones || "");
  const [url, setUrl] = useState(video?.URL || "");

  // Guardar o actualizar
  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return alert("No estás autenticado");

      let finalUrl = url;

      // Si hay un archivo nuevo, se sube
      if (file) {
        const { data, error } = await supabase.storage
          .from("videos")
          .upload(`uploads/${Date.now()}-${file.name}`, file, { upsert: true });

        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("videos")
          .getPublicUrl(data.path);

        finalUrl = publicUrl.publicUrl;
      }

      if (video) {
        //  ACTUALIZAR
        const { error } = await supabase
          .from("Videos")
          .update({
            Name: title,
            Description: description,
            Visibilidad: visibilidad,
            Restricciones: restricciones,
            URL: finalUrl,
          })
          .eq("id", video.id);

        if (error) throw error;
        alert("✅ Video actualizado correctamente");
      } else {
        // INSERTAR NUEVO
        const { error } = await supabase.from("Videos").insert([
          {
            user_id: user.id,
            Date: new Date(),
            Name: title,
            Description: description,
            Visibilidad: visibilidad,
            Restricciones: restricciones,
            URL: finalUrl,
          },
        ]);

        if (error) throw error;
        alert(" Video subido correctamente");
      }
      
      onClose();
    } catch (err) {
      console.error("Error guardando video:", err);
      alert(" Ocurrió un error al guardar el video");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50 p-4">
      <div className="bg-custom rounded-2xl w-full max-w-md md:w-250 md:h-200 max-h-screen shadow-lg flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-custom-gray-200 px-4 md:px-6 py-3 md:py-4">
          <h1 className="text-base md:text-lg font-semibold text-custom">
            {video ? "Editar video" : "Subir videos"}
          </h1>
          <button onClick={onClose} className="text-custom-gray-500 hover:text-custom cursor-pointer text-xl">✖</button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto px-4 md:px-6 py-4">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3 text-custom-gray-700">
              <HardDriveDownload size={60} className="md:w-20 md:h-20" />
            </div>
            <p className="text-custom-gray-700 mb-2 text-sm md:text-base">
              {video
                ? "Puedes cambiar los datos del video o subir uno nuevo"
                : "Selecciona archivos de video para subirlos"}
            </p>
            <p className="text-xs md:text-sm text-custom-gray-500 mb-4">
              Tus videos serán privados hasta que los publiques.
            </p>
            <label className="bg-black text-white px-4 py-2 text-sm rounded cursor-pointer inline-block"> 
              Seleccionar archivos
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])}/>
            </label>
            {(file || url) && (
              <p className="text-xs md:text-sm text-custom-gray-600 mt-2">
                📂 Archivo:{" "}
                <span className="font-medium">
                  {file ? file.name : "Ya existe un video"}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Título" 
              className="border border-custom-gray-300 bg-custom text-custom p-3 w-full rounded text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <textarea 
              placeholder="Descripción" 
              className="border border-custom-gray-300 bg-custom text-custom p-3 w-full rounded text-sm md:text-base h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-sm font-bold block text-custom">Visibilidad</label>
              <select 
                className="w-full border border-custom-gray-300 bg-custom text-custom rounded p-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={visibilidad}
                onChange={(e) => setVisibilidad(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="publica">Publico</option>
                <option value="privada">Privado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block text-custom">Restricciones</label>
              <select 
                className="w-full border border-custom-gray-300 bg-custom text-custom rounded p-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={restricciones} 
                onChange={(e) => setRestricciones(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                <option value="ninguna">Ninguna</option>
                <option value="ninos">Niños</option>
                <option value="adultos">Adultos</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-custom-gray-200 px-4 md:px-6 py-3 bg-custom-gray-50">
          <button 
            onClick={handleSave} 
            className="bg-blue-600 text-white px-4 md:px-6 py-2 text-sm md:text-base rounded hover:bg-blue-700 cursor-pointer w-full md:w-auto"
          >
            {video ? "Actualizar" : "Subir video"}
          </button>
        </div>
      </div>
    </div>
  );
};