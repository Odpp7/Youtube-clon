// components/VideoList.js
"use client";

import { VideoCard } from "./VideoCard";

export const VideoList = ({ videos, layout }) => {
  if (!videos || videos.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No hay videos</p>;
  }

  return (
    <div
      className={
        layout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
          : "flex flex-col gap-4 p-4"
      }
    >
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} layout={layout} />
      ))}
    </div>
  );
};
