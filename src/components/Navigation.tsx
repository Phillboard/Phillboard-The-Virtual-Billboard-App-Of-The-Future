
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  name: string;
  icon: JSX.Element;
};

const tabs: Tab[] = [
  {
    id: "map",
    name: "Map",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    id: "ar",
    name: "AR View",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    ),
  },
  {
    id: "stats",
    name: "Stats",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
        <path d="M3 3v18h18"/>
        <path d="m19 9-5 5-4-4-3 3"/>
      </svg>
    ),
  },
  {
    id: "profile",
    name: "Profile",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
      </svg>
    ),
  },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance threshold
  const minSwipeDistance = 50;
  
  // Handle swipe gestures for tab navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };
    
    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe || isRightSwipe) {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        
        if (isLeftSwipe && currentIndex < tabs.length - 1) {
          onTabChange(tabs[currentIndex + 1].id);
        } else if (isRightSwipe && currentIndex > 0) {
          onTabChange(tabs[currentIndex - 1].id);
        }
      }
    };
    
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStart, touchEnd, activeTab, onTabChange]);
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/60 backdrop-blur-lg border-t border-white/10 px-2 py-2 z-50">
      <nav className="flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-all",
              activeTab === tab.id 
                ? "text-neon-cyan" 
                : "text-gray-400"
            )}
          >
            <div 
              className={cn(
                "transition-all duration-300",
                activeTab === tab.id && "animate-pulse"
              )}
            >
              {tab.icon}
            </div>
            <span className="text-xs">{tab.name}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-[3px] w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
