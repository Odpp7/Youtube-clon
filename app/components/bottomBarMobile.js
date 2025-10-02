"use client"

import { Home, Compass, Music, Plus, Radio } from "lucide-react";
import { useRouter } from "next/navigation";

export const BottomBar = ({ onCategoryClick }) => {
  const router = useRouter()
  const navItems = [
    { icon: Home, label: 'Principal', searchTerm: 'mostPopular' },
    { icon: Compass, label: 'Shorts', searchTerm: 'shorts' },
    { icon: Plus, label: '', searchTerm: null, action: 'upload' },
    { icon: Music, label: 'Musica', searchTerm: 'musica' },
    { icon: Radio, label: 'En Directo', searchTerm: 'en vivo' },
  ];

  const handleClick = (item) => {
    if (item.action === 'upload') {
      router.push("/uploadvideo");
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