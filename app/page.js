"use client"
import { SearchBar } from "./components/SearchBar";
import { SideBar } from "./components/SideBar";
import { FilterTags } from "./components/FilterTags";
import { VideoList } from "./components/VideoList";
import SearchVideo from "./services/SearchVideo";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);

  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen); };

  useEffect(() => {
    SearchVideo("mostPopular").then(setVideos);
  }, []);

  return (
    <main>
      <SearchBar onMenuClick={toggleSidebar} />
      
      <section>
        <SideBar isOpen={isSidebarOpen} />

        <div>
          <FilterTags isSidebarOpen={isSidebarOpen} />
          <VideoList isSidebarOpen={isSidebarOpen} videos={videos} layout="grid" />
        </div>
      </section>
    </main>
  );
}