"use client"
import { SearchBar } from "./components/SearchBar";
import { SideBar } from "./components/SideBar";
import { BottomBar } from "./components/bottomBarMobile";
import { FilterTags } from "./components/FilterTags";
import { VideoList } from "./components/VideoList";
import SearchVideo from "./services/SearchVideo";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [videos, setVideos] = useState([]);

  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen); };

  const handleCategorySearch = (category) => {
    SearchVideo(category).then(setVideos);
  };

  useEffect(() => {
    SearchVideo("mostPopular").then(setVideos);
  }, []);

  return (
    <main>
      <SearchBar onMenuClick={toggleSidebar} />
      
      <section>
        <SideBar isOpen={isSidebarOpen} onCategoryClick={handleCategorySearch} />
        <BottomBar onCategoryClick={handleCategorySearch} />

        <div>
          <FilterTags isSidebarOpen={isSidebarOpen} onCategoryClick={handleCategorySearch} />
          <VideoList isSidebarOpen={isSidebarOpen} videos={videos} layout="grid" />
        </div>
      </section>
    </main>
  );
}