"use client";
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FilterTags = ({ isSidebarOpen }) => {
  const tags = ['Todos', 'Música', 'Videojuegos', 'Noticias', 'Reguetón', 'Podcasts', 'En tiempo real', 'Pop latino', 'Series de televisión', 'Mod de videojuegos', 'Modificaciones de Minecraft', 'Himno', 'Juegos de rol', 'Animación', 'Comedias', 'Balón de oro'];
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-60' : 'md:ml-16'}`}>
      <div className="relative px-6 py-4">
        <button onClick={scrollLeft} 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-custom hover:bg-custom-gray-100 p-2 rounded-full shadow-md border border-custom-gray-300 cursor-pointer text-custom"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div ref={scrollContainerRef} className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth mx-8" style={{ scrollbarWidth: 'none' }}>

          {tags.map((tag, index) => (
            <button key={index} 
              className="px-3 py-1.5 rounded-lg text-sm flex-shrink-0 border bg-custom-gray-100 border-custom-gray-300 hover:bg-custom-gray-200 cursor-pointer text-custom"
            >
              {tag}
            </button>
          ))}
        </div>

        <button onClick={scrollRight} 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-custom hover:bg-custom-gray-100 p-2 rounded-full shadow-md border border-custom-gray-300 cursor-pointer text-custom"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};