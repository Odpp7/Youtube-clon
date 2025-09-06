
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "../components/SearchBar";
import { SideBar } from "../components/SideBar";
import { FilterTags } from "../components/FilterTags";
import { VideoList } from "../components/VideoList";
import SearchVideo from "../services/SearchVideo";

export default function SearchContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      SearchVideo(query).then(setVideos).catch(console.error);
    }
  }, [query]);

  return (
    <div>
      <SearchBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <SideBar isOpen={isSidebarOpen} />
        <div className="flex-1">
          <FilterTags isSidebarOpen={isSidebarOpen} />
          <VideoList videos={videos} layout="list" />
        </div>
      </div>
    </div>
  );
}
