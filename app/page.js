"use client"
import { SearchBar } from "./components/SearchBar";
import { SideBar } from "./components/SideBar";
import { FilterTags } from "./components/FilterTags";
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main>
      <SearchBar onMenuClick={toggleSidebar} />
      
      <section>
        <SideBar isOpen={isSidebarOpen} />

        <div>
          <FilterTags isSidebarOpen={isSidebarOpen} />

        </div>
      </section>
    </main>
  );
}