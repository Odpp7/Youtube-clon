import { Home, Compass,PlaySquare,Clock,ThumbsUp,Download,Music,Film,Radio,Gamepad2,Trophy,Lightbulb,Shirt,  } from "lucide-react";

export const SideBar = ({isOpen, onCategoryClick}) =>{
  const mainItems = [
    { icon: Home, label: 'Principal' },
    { icon: Compass, label: 'Shorts' },
    { icon: PlaySquare, label: 'Suscripciones' },
  ];

  const libraryItems = [
    { icon: Clock, label: 'Historial' },
    { icon: PlaySquare, label: 'Tus videos' },
    { icon: ThumbsUp, label: 'Videos que te gustaron' },
    { icon: Download, label: 'Descargas' },
  ];

  const exploreItems = [
    { icon: Music, label: 'Música', searchTerm: 'musica' },
    { icon: Film, label: 'Películas', searchTerm: 'peliculas' },
    { icon: Radio, label: 'En directo', searchTerm: 'en vivo' },
    { icon: Gamepad2, label: 'Videojuegos', searchTerm: 'videojuegos' },
    { icon: Trophy, label: 'Deportes', searchTerm: 'deportes' },
    { icon: Lightbulb, label: 'Aprendizaje', searchTerm: 'educacion' },
    { icon: Shirt, label: 'Moda y belleza', searchTerm: 'moda belleza' },
  ];

    return(
    <aside className={`hidden md:block fixed left-0 top-16 h-full transition-all duration-300 z-40 ${isOpen ? 'w-60' : 'w-16'} overflow-y-auto`}>
      <div className="py-4">
        {/* Main Navigation */}
        <div className="px-2">
          {mainItems.map((item, key) => (
            <div key={key} className={"flex items-center space-x-6 px-3 py-2 rounded-lg hover:bg-[#F2F2F2] cursor-pointer"}>
              <item.icon size={20} />
              {isOpen && <span className="text-sm">{item.label}</span>}
            </div>
          ))}
        </div>

        {isOpen && <hr className="border-[#E5E5E5] my-2 border-1" />}

        {/* Library */}
        {isOpen && (
          <div className="px-2 mb-2">
            <div className="px-3 py-2 text-sm font-semibold">Biblioteca</div>
            {libraryItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-6 px-3 py-2 rounded-lg hover:bg-[#F2F2F2] cursor-pointer">
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {isOpen && <hr className="border-[#E5E5E5] my-2 border-1" />}

        {/* Explore */}
        {isOpen && (
          <div className="px-2">
            <div className="px-3 py-2 text-sm font-semibold">Explorar</div>
            {exploreItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-6 px-3 py-2 rounded-lg hover:bg-[#F2F2F2] cursor-pointer" onClick={() => onCategoryClick(item.searchTerm)}>
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}