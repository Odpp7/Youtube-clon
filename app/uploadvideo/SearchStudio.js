"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, User, ChevronDown, Users, ChevronRight, LogOut, HardDriveDownload, Video } from "lucide-react";
import { supabase } from "../services/supabaseClient";

export const SearchStudio = ({ onMenuClick, onUploadClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Verificar el estado de autenticación al cargar el componente
  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => {setUser(session?.user ?? null);});

    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null);
      setIsDropdownOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: window.location.href
      }
    });

    if (error) {
      console.error("Error en login:", error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToYoutube = () =>{
    router.push("/");
  }

  return (
    <header className="flex items-center justify-between px-2 md:px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={onMenuClick} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full cursor-pointer">
          <Menu size={18} className="md:w-5 md:h-5" />
        </button>
        <div className="flex items-center space-x-1">
          <img src="/YoutubeStudio.png" width="80" className="cursor-pointer md:w-[120px]"/>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-2 md:mx-8">
        <div className="flex">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Buscar" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <button onClick={handleSearch} className="px-3 md:px-6 bg-gray-50 border border-gray-300 rounded-r-full hover:bg-gray-200 cursor-pointer">
            <Search size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Iconos de la derecha */}
      <div className="flex gap-2 md:gap-5 items-center">
        <button onClick={onUploadClick} className="px-2 md:px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-200 cursor-pointer flex gap-1 md:gap-2 font-[600] text-sm md:text-base">
          <Video size={16} className="md:w-5 md:h-5" /> 
          <span className="hidden sm:inline">Crear</span>
        </button>
        
        <div className="relative user-dropdown">
          {user ? ( // Usuario autenticado
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 md:gap-2 cursor-pointer hover:bg-gray-50 rounded-full p-1">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-6 h-6 md:w-8 md:h-8 rounded-full"/> ) : ( getInitials(user.user_metadata?.full_name || user.email))}
              </div>
              <ChevronDown size={14} className="text-gray-600 md:w-4 md:h-4 hidden md:block" />
            </div>
          ) : ( // Usuario no autenticado
            <div onClick={handleLogin} className="flex items-center gap-1 md:gap-2 px-2 md:px-4 border border-gray-300 rounded-full hover:bg-[#DEF1FF] cursor-pointer py-1 md:py-2">
              <User size={18} className="text-[#065fd4] rounded-full border p-0.5 md:w-6 md:h-6 md:p-1" />
              <span className="text-xs md:text-sm text-[#065fd4] font-semibold hidden sm:inline">Acceder</span>
            </div>
          )}

          {/* Dropdown del usuario */}
          {user && isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 md:p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} className="w-8 h-8 md:w-10 md:h-10 rounded-full"/> ) : ( getInitials(user.user_metadata?.full_name || user.email))}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base"> {user.user_metadata?.full_name || "Usuario"} </p>
                    <p className="text-xs md:text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-1 md:p-2">
                <div onClick={handleLogin} className="flex items-center gap-3 p-2 md:p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5"> <Users/></svg>
                  </div>
                  <span className="text-gray-700 text-sm md:text-base">Cambiar de cuenta</span>
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-auto"> <ChevronRight size={12} className="md:w-4 md:h-4"/></svg>
                </div>
                
                <div onClick={goToYoutube} className="flex items-center gap-3 p-2 md:p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5"> <LogOut/> </svg>
                  </div>
                  <span className="text-sm md:text-base">Volver a Youtube</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};