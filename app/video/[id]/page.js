"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "../../components/SearchBar";
import { SideBar } from "../../components/SideBar";
import { VideoViewer } from "../../components/VideoViewer";
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
      <div className="flex">
        <SideBar isOpen={!isSidebarOpen} />
        <div className={`transition-all duration-300 flex-1 ${!isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <VideoViewer/>
        </div>
      </div>
    </div>
  );
}
