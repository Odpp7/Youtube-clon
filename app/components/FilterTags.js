"use client";
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FilterTags = ({ isSidebarOpen, onCategoryClick }) => {
  const tags = [
    { label: 'Todos', searchTerm: 'tendencia' },
    { label: 'Música', searchTerm: 'musica' },
    { label: 'En Videojuegos', searchTerm: 'videojuegos' },
    { label: 'Noticias', searchTerm: 'noticias' },
    { label: 'Reguetón', searchTerm: 'regueton' },
    { label: 'Podcasts', searchTerm: 'podcast' },
    { label: 'Pop latino', searchTerm: 'pop' },
    { label: 'Mod de videojuegos', searchTerm: 'mod videojuegos' },
    { label: 'Modificaciones de Minecraft', searchTerm: 'minecraft' },
    { label: 'Himno', searchTerm: 'himnos' },
    { label: 'Juegos de rol', searchTerm: 'juegos de rol' },
    { label: 'Animación', searchTerm: 'animacion' },
    { label: 'Comedias', searchTerm: 'comedia' },
    { label: 'Balón de oro', searchTerm: 'balon de oro' },
    { label: 'Religion', searchTerm: 'religion' },
    { label: 'Danza', searchTerm: 'danza' },
    { label: 'Mundo', searchTerm: 'mundo' },
    { label: 'Guitarra', searchTerm: 'guitarra' },
     { label: 'Cine', searchTerm: 'peliculas' },
  ];
  
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
        
        <div ref={scrollContainerRef} className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth mx-8" style={{ scrollbarWidth: 'none' }} onClick={() => onCategoryClick(tags.searchTerm)} >
          {tags.map((tag, index) => (
            <button key={index}  
              className="px-3 py-1.5 rounded-lg text-sm flex-shrink-0 border bg-custom-gray-100 border-custom-gray-300 hover:bg-custom-gray-200 cursor-pointer text-custom"
            >
              {tag.label}
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