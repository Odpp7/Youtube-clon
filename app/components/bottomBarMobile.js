"use client"

import { Home, Compass, Music, Plus, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../services/supabaseClient";

export const BottomBar = ({ onCategoryClick }) => {
  const [user, setUser] = useState(null);
  const router = useRouter()
  const navItems = [
    { icon: Home, label: 'Principal', searchTerm: 'mostPopular' },
    { icon: Compass, label: 'Shorts', searchTerm: 'shorts' },
    { icon: Plus, label: '', searchTerm: null, action: 'upload' },
    { icon: Music, label: 'Musica', searchTerm: 'musica' },
    { icon: Radio, label: 'En Directo', searchTerm: 'en vivo' },
  ];
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleClick = (item) => {
    if (item.action === 'upload') {
      if (user) {
        router.push("/uploadvideo");
      } else {
        alert("Debes iniciar sesión para subir videos");
      }
    } else if (item.searchTerm) {
      onCategoryClick(item.searchTerm);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-custom border-t border-custom-gray-200 z-50">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item, index) => (
          <button key={index} onClick={() => handleClick(item)} className="flex flex-col items-center justify-center flex-1 h-full active:bg-custom-gray-100">
              <item.icon size={22} className="text-custom" />
              <span className="text-[10px] mt-0.5 text-custom">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};