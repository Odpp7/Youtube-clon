"use client";
import { useState } from "react";
import { SearchStudio } from "./SearchStudio";
import { SideBarStudio } from "./SideBarStudio";
import { VideoSection } from "./VideoSection";
import { ModalVideo } from "./modalVideo";

export default function UploadVideoPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div>
      <SearchStudio onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} onUploadClick={() => setIsUploadModalOpen(true)} />

      <div className="flex">
        <SideBarStudio isOpen={isSidebarExpanded} />
        <VideoSection isSidebarOpen={isSidebarExpanded} />
      </div>

      {isUploadModalOpen && (
        <ModalVideo onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
}