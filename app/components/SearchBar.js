"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Mic, User, EllipsisVertical, ChevronDown, Users, ChevronRight, LogOut, HardDriveUpload, HardDriveDownload  } from "lucide-react";
import { supabase } from "../services/supabaseClient";

export const SearchBar = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Verificar el estado de autenticación al cargar el componente
  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => {setUser(session?.user ?? null);});

    // Escuchar cambios en la autenticación
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

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToUpload = () =>{
    router.push("/uploadvideo");
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Logo y menú */}
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
          <Menu size={20} />
        </button>
        <div className="flex items-center space-x-1" onClick={(e) => { e.preventDefault(); router.push('/');}}>
          <img src="/Youtube.png" width="150" className="cursor-pointer"/>
          <span className="text-xs text-gray-500 ml-1">CO</span>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="flex">
          <div className="flex-1 relative">
            <input type="text" placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <button onClick={handleSearch} className="px-6 bg-gray-50 border border-gray-300 rounded-r-full hover:bg-gray-200 cursor-pointer">
            <Search size={20} />
          </button>
          <button className="ml-4 rounded-full px-3 bg-gray-50 border border-gray-300 hover:bg-gray-200 cursor-pointer">
            <Mic size={20} />
          </button>
        </div>
      </div>

      {/* Iconos de la derecha */}
      <div className="flex gap-5 items-center">
        <button className="cursor-pointer">
          <EllipsisVertical />
        </button>
        
        <div className="relative user-dropdown">
          {user ? ( // Usuario autenticado
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-full p-1">
              <div className="w-8 h-8 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full"/> ) : ( getInitials(user.user_metadata?.full_name || user.email))}
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </div>
          ) : ( // Usuario no autenticado
            <div onClick={handleLogin} className="flex items-center gap-2 px-4 border border-gray-300 rounded-full hover:bg-[#DEF1FF] cursor-pointer py-2">
              <User size={23} className="text-[#065fd4] rounded-full border p-1" />
              <span className="text-sm text-[#065fd4] font-semibold">Acceder</span>
            </div>
          )}

          {/* Dropdown del usuario */}
          {user && isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full"/> ) : ( getInitials(user.user_metadata?.full_name || user.email))}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900"> {user.user_metadata?.full_name || "Usuario"} </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <button className="text-sm text-[#065fd4] hover:underline mt-1"> Crear un canal </button>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <div onClick={handleLogin} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5"> <Users/></svg>
                  </div>
                  <span className="text-gray-700">Cambiar de cuenta</span>
                  <svg className="w-4 h-4 ml-auto"> <ChevronRight size={15}/></svg>
                </div>

                <div onClick={goToUpload} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5"> <HardDriveDownload/></svg>
                  </div>
                  <span className="text-gray-700">Subir un video</span>
                </div>
                
                <div onClick={handleLogout} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5"> <LogOut/> </svg>
                  </div>
                  <span>Cerrar sesión</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};