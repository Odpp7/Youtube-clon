"use client";
import { useState } from "react";
import { SearchStudio } from "./SearchStudio";
import { SideBarStudio } from "./SideBarStudio";
import { VideoSection } from "./VideoSection";
import { ModalVideo } from "./modalVideo";

export default function UploadVideoPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allVideos, setAllVideos] = useState([]);

  const handleSearch = (results, term) => {
    setFilteredVideos(results);
    setSearchTerm(term);
  };

  const handleVideosLoaded = (videos) => {
    setAllVideos(videos);
  };

  return (
    <div>
      <SearchStudio 
        onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        onUploadClick={() => setIsUploadModalOpen(true)}
        onSearch={handleSearch}
        videos={allVideos}
      />

      <div className="flex">
        <SideBarStudio isOpen={isSidebarExpanded} />
        <VideoSection 
          isSidebarOpen={isSidebarExpanded}
          filteredVideos={filteredVideos}
          searchTerm={searchTerm}
          onVideosLoaded={handleVideosLoaded}
        />
      </div>

      {isUploadModalOpen && (
        <ModalVideo onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
}