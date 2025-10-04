"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Mic, User, Moon, Sun, ChevronDown, Users, ChevronRight, LogOut, HardDriveDownload } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { useTheme } from "../context/themeContext";

export const SearchBar = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => { 
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => { 
      setUser(session?.user ?? null);
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
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error("Error en login:", error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error en logout:", error.message);
    }
    setIsDropdownOpen(false);
  };

  const goToUpload = () => {
    router.push("/uploadvideo");
  };


  return (
    <header className="flex items-center justify-between px-2 md:px-4 py-2 bg-custom border-b border-custom-gray-200 sticky top-0 z-50">
      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={onMenuClick} className="p-1.5 md:p-2 hover:bg-custom-gray-100 rounded-full cursor-pointer hidden md:block">
          <Menu size={18} className="md:w-5 md:h-5 text-custom" />
        </button>
        <div className="flex items-center space-x-1" onClick={(e) => { e.preventDefault(); router.push('/');}}>
          <img src="/Youtube.png" className="cursor-pointer md:w-[150px] w-[100px]"/>
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
              className="w-full px-2 md:px-4 py-1.5 md:py-2 border border-custom-gray-300 rounded-l-full focus:outline-none search"
            />
          </div>
          <button onClick={handleSearch} className="px-3 md:px-6 bg-custom-gray-50 border border-custom-gray-300 rounded-r-full hover:bg-custom-gray-200 cursor-pointer">
            <Search size={16} className="md:w-5 md:h-5 text-custom" />
          </button>
          <button className="hidden md:block ml-2 md:ml-4 rounded-full px-2 md:px-3 bg-custom-gray-50 border border-custom-gray-300 hover:bg-custom-gray-200 cursor-pointer">
            <Mic size={16} className="md:w-5 md:h-5 text-custom" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 md:gap-5 items-center">
        <button onClick={toggleTheme} className="p-2 hover:bg-custom-gray-100 rounded-full text-custom cursor-pointer">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="relative user-dropdown">
          {user ? (
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 md:gap-2 cursor-pointer hover:bg-custom-gray-50 rounded-full p-1">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-xs md:text-sm font-semibold">
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-6 h-6 md:w-8 md:h-8 rounded-full"/>
              </div>
              <ChevronDown size={14} className="text-custom-gray-600 md:w-4 md:h-4 hidden md:block" />
            </div>
          ) : (
            <div onClick={handleLogin} className="flex items-center gap-1 md:gap-2 px-2 md:px-4 border border-custom-gray-300 rounded-full hover:bg-[#DEF1FF] cursor-pointer py-1 md:py-2">
              <User size={18} className="text-[#065fd4] rounded-full border p-0.5 md:w-6 md:h-6 md:p-1" />
              <span className="text-xs md:text-sm text-[#065fd4] font-semibold hidden sm:inline">Acceder</span>
            </div>
          )}

          {user && isDropdownOpen && (
            <div className="dropdown-menu absolute right-0 top-full mt-2 w-72 md:w-80 bg-custom border border-custom-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 md:p-4 border-b border-custom-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      <img src={user.user_metadata.avatar_url} className="w-8 h-8 md:w-10 md:h-10 rounded-full"/>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-custom text-sm md:text-base">
                      {user.user_metadata?.full_name || "Usuario"}
                    </p>
                    <p className="text-xs md:text-sm text-custom-gray-600">{user.email}</p>
                    <button className="text-xs md:text-sm text-[#065fd4] hover:underline mt-1">
                      Crear un canal
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-1 md:p-2">
                <div onClick={handleLogin} className="flex items-center gap-3 p-2 md:p-3 hover:bg-custom-gray-50 rounded cursor-pointer">
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-custom" />
                  </div>
                  <span className="text-custom-gray-700 text-sm md:text-base">Cambiar de cuenta</span>
                  <ChevronRight size={12} className="md:w-4 md:h-4 ml-auto text-custom" />
                </div>

                <div onClick={goToUpload} className="flex items-center gap-3 p-2 md:p-3 hover:bg-custom-gray-50 rounded cursor-pointer">
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    <HardDriveDownload className="w-4 h-4 md:w-5 md:h-5 text-custom" />
                  </div>
                  <span className="text-custom-gray-700 text-sm md:text-base">Subir un video</span>
                </div>
                
                <div onClick={handleLogout} className="flex items-center gap-3 p-2 md:p-3 hover:bg-custom-gray-50 rounded cursor-pointer">
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    <LogOut className="w-4 h-4 md:w-5 md:h-5 text-custom" />
                  </div>
                  <span className="text-sm md:text-base text-custom">Cerrar sesión</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};