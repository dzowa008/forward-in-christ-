import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music2, ArrowLeft } from 'lucide-react';
import { ShortVideo } from '../types';

interface FeedViewProps {
  shorts: ShortVideo[];
}

const FeedView: React.FC<FeedViewProps> = ({ shorts }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex]);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar relative"
    >
      {shorts.map((short, index) => (
        <div key={short.id} className="h-screen w-full snap-start relative flex justify-center bg-gray-900">
           {/* Simulated Video Player */}
          <div className="relative w-full h-full max-w-md bg-slate-800">
            <img 
              src={`https://picsum.photos/seed/${short.id}/400/800`} 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover opacity-80"
            />
            
            {/* Play Button Overlay (Simulated) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {activeIndex !== index && <div className="bg-black/40 rounded-full p-4"><div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div></div>}
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6 text-white">
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-slate-800/50 p-3 rounded-full hover:bg-slate-700/50 cursor-pointer backdrop-blur-sm">
                  <Heart size={28} fill={index === 0 ? "red" : "none"} className={index === 0 ? "text-red-500" : "text-white"} />
                </div>
                <span className="text-xs font-semibold">{short.likes + (index === 0 ? 1 : 0)}</span>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-slate-800/50 p-3 rounded-full hover:bg-slate-700/50 cursor-pointer backdrop-blur-sm">
                  <MessageCircle size={28} />
                </div>
                <span className="text-xs font-semibold">45</span>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-full hover:bg-slate-700/50 cursor-pointer backdrop-blur-sm">
                <Share2 size={28} />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute left-0 bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white pb-20 md:pb-6">
              <div className="mb-2">
                <h3 className="font-bold text-lg">@{short.creator}</h3>
                <p className="text-sm text-gray-200 line-clamp-2">{short.description}</p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <Music2 size={14} className="animate-spin-slow" />
                <span>Original Audio - ZimPraise Choir</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedView;
