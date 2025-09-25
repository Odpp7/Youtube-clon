"use client";
import { useState } from "react";
import { SearchStudio } from "./SearchStudio";
import { SideBarStudio } from "./SideBarStudio";
import { VideoSection } from "./VideoSection";
import { ModalVideo } from "./modalVideo";

export default function UploadVideoPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div>
      <SearchStudio onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} onUploadClick={() => setIsUploadModalOpen(true)} />

      <div className="flex">
        <SideBarStudio isOpen={isSidebarOpen} />
        <VideoSection isSidebarOpen={isSidebarOpen} />
      </div>

      {isUploadModalOpen && (
        <ModalVideo onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
}
