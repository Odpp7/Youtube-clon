"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Mic, User, EllipsisVertical } from "lucide-react";

export const SearchBar = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Logo y menú */}
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
          <Menu size={20} />
        </button>
        <div className="flex items-center space-x-1">
          <img
            src="/Youtube.png"
            alt="YouTube Logo"
            width="150"
            className="cursor-pointer"
          />
          <span className="text-xs text-gray-500 ml-1">CO</span>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="flex">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 bg-gray-50 border border-gray-300 rounded-r-full hover:bg-gray-200 cursor-pointer"
          >
            <Search size={20} />
          </button>
          <button className="ml-4 rounded-full px-3 bg-gray-50 border border-gray-300 hover:bg-gray-200 cursor-pointer">
            <Mic size={20} />
          </button>
        </div>
      </div>

      {/* Iconos de la derecha */}
      <div className="flex gap-5">
        <button className="cursor-pointer">
          <EllipsisVertical />
        </button>
        <div className="flex items-center gap-2 px-4 border border-gray-300 rounded-full hover:bg-[#DEF1FF] cursor-pointer">
          <button className="p-2 cursor-pointer">
            <User
              size={23}
              className="text-[#065fd4] rounded-full border"
            />
          </button>
          <span className="text-sm text-[#065fd4] font-semibold">Acceder</span>
        </div>
      </div>
    </header>
  );
};
