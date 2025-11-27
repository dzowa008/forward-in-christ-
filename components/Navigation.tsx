import React from 'react';
import { Home, PlayCircle, MessageCircle, Heart, User, BookOpen, Sun, Video } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sermons', label: 'Sermons', icon: PlayCircle }, // Changed from Pulpit
    { id: 'feed', label: 'Feed', icon: Video }, // Changed from Inspire
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'shepherd', label: 'Shepherd', icon: Sun },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 p-4 z-50">
        <h1 className="text-2xl font-bold mb-8 text-amber-400 tracking-tight">Jesus Christ is Lord</h1>
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id ? 'bg-amber-500 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 pb-safe z-50">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center p-2 rounded-full transition-colors ${
              currentView === item.id ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Navigation;