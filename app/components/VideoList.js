"use client";

import { VideoCard } from "./VideoCard";
import { SupabaseVideoList } from "./supabaseVideoList";

export const VideoList = ({ videos, layout, isSidebarOpen, isInSidebar }) => {
  if (isInSidebar) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {videos?.map((video, index) => (
          <VideoCard key={index} video={video} layout="list" />
        ))}
        <SupabaseVideoList layout="list" />
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className={`transition-all duration-300 ${
        layout === "grid" 
          ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ml-0 ${isSidebarOpen ? 'md:ml-60' : 'md:ml-16'}`
          : `flex flex-col gap-4 p-4 ml-0 ${isSidebarOpen ? 'md:ml-60' : 'md:ml-16'}`
      }`}>
        <SupabaseVideoList layout={layout} />
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ${
      layout === "grid" 
        ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ml-0 ${isSidebarOpen ? 'md:ml-60' : 'md:ml-16'}`
        : `flex flex-col gap-4 p-4 ml-0 ${isSidebarOpen ? 'md:ml-60' : 'md:ml-16'}`
    }`}>   
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} layout={layout} />
      ))}
      <SupabaseVideoList layout={layout} />
    </div>
  );
};
