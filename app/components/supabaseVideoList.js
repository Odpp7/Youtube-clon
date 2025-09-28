"use client";

import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { VideoCard } from "./VideoCard";

export const SupabaseVideoList = ({ layout = "grid" }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      console.log("No hay usuario autenticado");
      setVideos([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("Videos")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error al traer videos de Supabase:", error);
    } else {
      setVideos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} layout={layout} />
      ))}
    </div>
  );
};
