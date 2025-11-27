import React, { useState } from 'react';
import { generateKidsStory } from '../services/geminiService';
import { KidsStory } from '../types';
import { Sparkles, BookOpen, ChevronRight, RefreshCw } from 'lucide-react';

const KidsView: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [story, setStory] = useState<KidsStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setStory(null);
    setPageIndex(0);
    const result = await generateKidsStory(topic);
    setStory(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-sky-50 pb-24 md:pl-64 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-white p-6 shadow-sm mb-6 text-center">
        <h1 className="text-3xl font-bold text-sky-600 font-serif">Kids' Kingdom</h1>
        <p className="text-sky-400">Magical Bible stories just for you!</p>
      </div>

      {!story && !loading && (
        <div className="w-full max-w-md p-6">
           <div className="bg-white rounded-2xl p-8 shadow-lg text-center space-y-6">
              <div className="w-20 h-20 bg-sky-100 rounded-full mx-auto flex items-center justify-center">
                  <Sparkles size={40} className="text-sky-500" />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-slate-800">What story should we tell?</h2>
                  <p className="text-sm text-slate-500 mt-2">Try "David and Goliath" or "A kind boy sharing lunch"</p>
              </div>
              <input 
                type="text" 
                className="w-full border-2 border-sky-200 rounded-xl p-4 text-center text-lg focus:outline-none focus:border-sky-500"
                placeholder="Type a topic here..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button 
                onClick={handleGenerate}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl text-lg shadow-md transition-transform hover:scale-105"
              >
                  Create Story
              </button>
           </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <RefreshCw className="animate-spin text-sky-500" size={48} />
            <p className="text-sky-700 font-medium animate-pulse">Writing a wonderful story...</p>
        </div>
      )}

      {story && (
        <div className="w-full max-w-4xl p-4 flex flex-col items-center">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full aspect-[4/3] md:aspect-video relative group">
                {/* Image */}
                <img 
                    src={story.pages[pageIndex].imageUrl} 
                    alt={`Page ${pageIndex + 1}`} 
                    className="w-full h-full object-cover"
                />
                
                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 md:p-8 text-white backdrop-blur-sm">
                    <p className="text-lg md:text-2xl font-medium leading-relaxed font-serif">
                        {story.pages[pageIndex].text}
                    </p>
                </div>

                {/* Controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {pageIndex + 1} / {story.pages.length}
                    </span>
                </div>
                
                {pageIndex < story.pages.length - 1 ? (
                    <button 
                        onClick={() => setPageIndex(p => p + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-sky-600 p-4 rounded-full shadow-lg transition-transform hover:scale-110"
                    >
                        <ChevronRight size={32} />
                    </button>
                ) : (
                    <button 
                        onClick={() => { setStory(null); setTopic(""); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full shadow-lg font-bold"
                    >
                        Read Another
                    </button>
                )}
                
                {pageIndex > 0 && (
                     <button 
                        onClick={() => setPageIndex(p => p - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-sky-600 p-4 rounded-full shadow-lg transition-transform hover:scale-110 rotate-180"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-slate-800">{story.title}</h2>
        </div>
      )}
    </div>
  );
};

export default KidsView;
