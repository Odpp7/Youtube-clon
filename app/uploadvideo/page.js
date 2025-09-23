"use client";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function UploadVideo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // 🔹 Nombre único para el archivo
      const fileName = `${Date.now()}_${file.name}`;

      // 1. Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("videos") // 👈 asegúrate de tener el bucket "videos"
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener la URL pública
      const { data: publicData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;

      // 3. Guardar metadata en la tabla `Videos`
      const { error: insertError } = await supabase
        .from("Videos")
        .insert([
          {
            name,
            description,
            date: new Date().toISOString(),
            url: publicUrl, // 👈 agrega esta columna en tu tabla
          },
        ]);

      if (insertError) throw insertError;

      setVideoUrl(publicUrl);
      alert("✅ Video subido y guardado en la base de datos");

    } catch (error) {
      console.error("Error subiendo video:", error.message);
      alert("❌ Error al subir video: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Subir Video</h2>

      <input
        type="text"
        placeholder="Nombre del video"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input type="file" accept="video/*" onChange={handleUpload} />

      {loading && <p>⏳ Subiendo...</p>}

      {videoUrl && (
        <video src={videoUrl} controls className="w-full rounded-lg"></video>
      )}
    </div>
  );
}
