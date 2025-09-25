"use client";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { HardDriveDownload } from "lucide-react";

export const ModalVideo = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibilidad, setVisibilidad] = useState("");
  const [restricciones, setRestricciones] = useState("");

    const handleUpload = async () => {
    if (!file) return alert("Selecciona un archivo");

    try {
        // Subir archivo a supabase storage
        const { data, error } = await supabase.storage
        .from("videos")
        .upload(`uploads/${Date.now()}-${file.name}`, file);

        if (error) throw error;

        // Obtener URL pública
        const { data: publicUrl } = supabase.storage
        .from("videos")
        .getPublicUrl(data.path);

        // Guardar en tabla
        const { error: insertError } = await supabase.from("Videos").insert([
        {
            Date: new Date(),
            Name: title,
            Description: description,
            Visibilidad: visibilidad,
            Restricciones: restricciones,
            URL: publicUrl.publicUrl,
        },
        ]);

        if (insertError) throw insertError;

        alert("Video subido con éxito!");
        onClose();

    } catch (err) {
        console.error("Error subiendo video:", err);
        alert("Ocurrió un error al subir el video");
    }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-250 h-200 shadow-lg flex flex-col relative">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h1 className="text-lg font-semibold">Subir videos</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-black cursor-pointer">✖</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="p-10 w-full">
            <div className="flex justify-center mb-4 text-5xl text-gray-700"><HardDriveDownload size={80}/></div>
            <p className="text-gray-700 mb-2">Selecciona archivos de video para subirlos</p>
            <p className="text-sm text-gray-500 mb-4">Tus videos serán privados hasta que los publiques.</p>
            <label className="bg-black text-white px-5 py-2 rounded cursor-pointer inline-block">Seleccionar archivos
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])}/>
            </label>
            {file && (<p className="text-sm text-gray-600 mt-2"> 📂 Archivo seleccionado: <span className="font-medium">{file.name}</span></p>)}
          </div>

          <input type="text" placeholder="Título" className="border p-2 w-200 my-3 rounded" onChange={(e) => setTitle(e.target.value)}/>
          <textarea placeholder="Descripción" className="border p-2 w-200 rounded" onChange={(e) => setDescription(e.target.value)}/>

            <div className="flex items-center justify-between gap-15">
            <label className="text-sm font-bold">Visibilidad</label>
            <select className="w-100 border rounded p-2 mt-3 focus:ring-blue-500" onChange={(e) => setVisibilidad(e.target.value)}>
                <option value="publica">Publica</option>
                <option value="privada">Privada</option>
            </select>
            </div>

            <div className="flex items-center justify-between gap-10">
            <label className="text-sm font-bold">Restricciones</label>
            <select className="w-100 border rounded p-2 mt-3 focus:ring-blue-500" onChange={(e) => setRestricciones(e.target.value)}>
                <option value="ninguna">Ninguna</option>
                <option value="ninos">Niños</option>
                <option value="adultos">Adultos</option>
            </select>
            </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-3">
          <button onClick={handleUpload} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer">Subir video</button>
        </div>
      </div>
    </div>
  );
};
