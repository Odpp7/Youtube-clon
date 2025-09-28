"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "../components/SearchBar";
import { FilterTags } from "../components/FilterTags";
import { VideoList } from "../components/VideoList";
import SearchVideo from "../services/SearchVideo";

export default function SearchContent() {
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
      <SearchBar />
      <FilterTags />
      <VideoList videos={videos} layout="list" />
    </div>
  );
}
