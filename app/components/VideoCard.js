// components/VideoCard.js
"use client";

export const VideoCard = ({ video, layout }) => {
  const {snippet} = video;

  return (
    <div
      className={`cursor-pointer ${
        layout === "grid" ? "w-80" : "flex w-full"
      }`}
    >
      {/* Miniatura */}
      <img
        src={snippet.thumbnails.medium.url}
        alt={snippet.title}
        className={`rounded-xl ${
          layout === "grid" ? "w-full" : "w-64 h-36 mr-4"
        }`}
      />

      {/* Info */}
      <div className={layout === "grid" ? "mt-2" : "flex flex-col justify-between"}>
        <h3 className="text-sm font-semibold line-clamp-2">{snippet.title}</h3>
        <p className="text-xs text-gray-600">{snippet.channelTitle}</p>
        <p>{}</p>
      </div>
    </div>
  );
};
