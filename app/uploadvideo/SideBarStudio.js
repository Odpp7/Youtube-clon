import { Home, Compass, PlaySquare } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export const SideBarStudio = ({ isOpen }) => {
  const [user, setUser] = useState(null);
  
  const mainItems = [
    { icon: PlaySquare, label: 'Contenido' },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
<aside className={`fixed left-0 top-16 h-full transition-all duration-300 z-40 bg-custom border-r border-custom-gray-200 ${isOpen ? 'w-60' : 'w-16'} overflow-y-auto`}>
  <div className="py-4">
    
    {user && isOpen && (
      <div className="px-4 mb-4">
        <div className="flex items-center gap-3 p-3 bg-custom-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {user.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              "U"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-custom text-sm truncate">
              {user.user_metadata?.full_name || "Usuario"}
            </p>
            <p className="text-xs text-custom-gray-600 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    )}

    {user && !isOpen && (
      <div className="px-2 mb-4 flex justify-center">
        <div className="w-8 h-8 bg-[#065fd4] text-white rounded-full flex items-center justify-center text-xs font-semibold">
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            "U"
          )}
        </div>
      </div>
    )}

    <div className="px-2">
      {mainItems.map((item, key) => (
        <div key={key} className="flex items-center space-x-6 px-3 py-2 rounded-lg hover:bg-custom-gray-100 cursor-pointer text-custom">
          <item.icon size={20} />
          {isOpen && <span className="text-sm">{item.label}</span>}
        </div>
      ))}
    </div>
  </div>
</aside>
  );
};