"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "../../components/SearchBar";
import { VideoViewer } from "./VideoViewer";
import SearchVideo from "../../services/SearchVideo";

export default function VideoPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {if (query) {SearchVideo(query).then(setVideos).catch(console.error);}}, [query]);


  return (
    <div>
      <SearchBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <VideoViewer/>
    </div>
  );
}
