import React, { useState, useEffect } from 'react';
import { Sermon, Note, Song } from '../types';
import { Play, Calendar, Eye, FileText, Check, Plus, Loader2, Music, Mic2, Pause } from 'lucide-react';
import { summarizeSermonText } from '../services/geminiService';

interface SermonViewProps {
  sermons: Sermon[];
  songs: Song[];
  notes: Note[];
  onAddNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const SermonView: React.FC<SermonViewProps> = ({ sermons, songs, notes, onAddNote, onDeleteNote }) => {
  const [activeTab, setActiveTab] = useState<'sermons' | 'praise'>('sermons');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [noteContent, setNoteContent] = useState("");
  const [isAutoNoting, setIsAutoNoting] = useState(false);

  // Auto-Note Simulation for Live Sermons
  useEffect(() => {
    let interval: any;
    if (isAutoNoting && selectedSermon?.isLive) {
      interval = setInterval(() => {
        const phrases = [
          " • God is calling us to a higher level of faith.",
          "\n • Stewardship requires discipline and vision.",
          "\n • Remember: Grace is sufficient for you.",
          "\n • The scripture says we must walk by faith, not by sight."
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setNoteContent(prev => prev + randomPhrase);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoNoting, selectedSermon]);

  const handleSummarize = async (sermon: Sermon) => {
    if (!sermon.transcript) return;
    setIsSummarizing(true);
    const result = await summarizeSermonText(sermon.transcript);
    setSummary(result);
    setIsSummarizing(false);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      sermonId: selectedSermon?.id || selectedSong?.id,
      title: selectedSermon ? `Notes: ${selectedSermon.title}` : (selectedSong ? `Notes: ${selectedSong.title}` : 'General Note'),
      content: noteContent,
      createdAt: new Date(),
    };
    onAddNote(newNote);
    setNoteContent("");
    setIsAutoNoting(false);
  };

  const liveSermon = sermons.find(s => s.isLive);
  const recentSermons = sermons.filter(s => !s.isLive);

  // Group by series
  const seriesGroups = recentSermons.reduce((acc, sermon) => {
    const key = sermon.series;
    if (!acc[key]) acc[key] = [];
    acc[key].push(sermon);
    return acc;
  }, {} as Record<string, Sermon[]>);

  // Determine what to display based on active item
  const renderPlayer = () => {
    if (selectedSermon) {
      return (
        <div className="lg:col-span-2 space-y-4">
            {/* Simulated Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
               <img src={selectedSermon.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="thumbnail" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Play size={64} className="text-white opacity-80" fill="white" />
               </div>
               {selectedSermon.isLive && (
                 <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-bold text-sm animate-pulse">
                   LIVE
                 </div>
               )}
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{selectedSermon.title}</h1>
                <p className="text-slate-400">{selectedSermon.preacher} • {selectedSermon.series}</p>
              </div>
              <div className="flex space-x-2">
                 {selectedSermon.isLive ? (
                    <button 
                        onClick={() => setIsAutoNoting(!isAutoNoting)}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isAutoNoting ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    >
                        {isAutoNoting ? <Pause size={18} fill="white"/> : <Mic2 size={18} />}
                        <span>{isAutoNoting ? 'Stop Auto-Notes' : 'Start Auto-Notes'}</span>
                    </button>
                 ) : (
                    <button 
                        onClick={() => handleSummarize(selectedSermon)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        disabled={isSummarizing || !selectedSermon.transcript}
                    >
                        {isSummarizing ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                        <span>AI Summary</span>
                    </button>
                 )}
              </div>
            </div>

            {summary && (
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-purple-400 mb-2">AI Key Takeaways</h3>
                <div className="prose prose-invert text-sm max-w-none whitespace-pre-line">
                  {summary}
                </div>
              </div>
            )}
        </div>
      );
    } 
    
    if (selectedSong) {
        return (
            <div className="lg:col-span-2 space-y-4">
                 <div className="aspect-square md:aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center">
                    <img src={selectedSong.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" alt="bg" />
                    <img src={selectedSong.thumbnail} className="relative w-64 h-64 rounded-lg shadow-lg object-cover z-10" alt="album art" />
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-8 z-20">
                         <Play size={48} className="text-white cursor-pointer hover:scale-110 transition-transform" fill="white"/>
                    </div>
                 </div>
                 <div>
                    <h1 className="text-3xl font-bold">{selectedSong.title}</h1>
                    <p className="text-xl text-slate-400">{selectedSong.artist} • {selectedSong.album}</p>
                 </div>
            </div>
        )
    }
    return null;
  };

  if (selectedSermon || selectedSong) {
    return (
      <div className="bg-slate-900 min-h-screen text-white p-4 pb-24 md:pl-72">
        <button 
            onClick={() => { setSelectedSermon(null); setSelectedSong(null); setIsAutoNoting(false); }} 
            className="mb-4 text-slate-300 hover:text-white flex items-center"
        >
          &larr; Back to Library
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderPlayer()}

          <div className="bg-slate-800 rounded-xl p-4 h-fit">
            <h3 className="font-bold mb-4 text-lg">
                {isAutoNoting ? 'Live Notes (AI Active)' : 'My Notes'}
            </h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-500 mb-2"
              placeholder={isAutoNoting ? "Listening to sermon..." : "Take notes..."}
              readOnly={isAutoNoting}
            />
            <button 
              onClick={handleSaveNote}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded-lg"
            >
              Save Note
            </button>

            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Previous Notes</h4>
              {notes.filter(n => n.sermonId === (selectedSermon?.id || selectedSong?.id)).map(note => (
                <div key={note.id} className="bg-slate-900 p-3 rounded border border-slate-700 text-sm">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                     <button onClick={() => onDeleteNote(note.id)} className="text-red-400 hover:text-red-300">&times;</button>
                  </div>
                  <p className="text-slate-300">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white pb-24 md:pl-64">
      
      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm p-4 border-b border-slate-800 flex space-x-6">
          <button 
            onClick={() => setActiveTab('sermons')}
            className={`text-lg font-bold pb-2 border-b-2 transition-colors ${activeTab === 'sermons' ? 'text-amber-500 border-amber-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
              Sermons
          </button>
          <button 
            onClick={() => setActiveTab('praise')}
            className={`text-lg font-bold pb-2 border-b-2 transition-colors ${activeTab === 'praise' ? 'text-amber-500 border-amber-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
              Praise & Worship
          </button>
      </div>

      {activeTab === 'sermons' && (
        <>
        {/* Live Banner */}
        {liveSermon && (
            <div className="relative h-[50vh] w-full bg-black flex items-end p-8 cursor-pointer group" onClick={() => setSelectedSermon(liveSermon)}>
            <img src={liveSermon.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" alt="Live" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
            
            <div className="relative z-10 max-w-3xl">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block animate-pulse">
                Live Now
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{liveSermon.title}</h1>
                <p className="text-lg text-slate-200 mb-4">{liveSermon.preacher} • Harare Central</p>
                <button className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-slate-200 transition-colors flex items-center space-x-2">
                <Play size={20} fill="black" /> <span>Watch Live</span>
                </button>
            </div>
            </div>
        )}

        {/* Series Rows */}
        <div className="p-6 space-y-8">
            {Object.keys(seriesGroups).map((series) => (
            <div key={series}>
                <h2 className="text-xl font-bold mb-4 text-slate-100">{series}</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                {seriesGroups[series].map(sermon => (
                    <div 
                    key={sermon.id} 
                    className="min-w-[200px] w-[200px] cursor-pointer group"
                    onClick={() => setSelectedSermon(sermon)}
                    >
                    <div className="aspect-[3/4] bg-slate-800 rounded-md overflow-hidden mb-2 relative">
                        <img src={sermon.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={sermon.title} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Play size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white"/>
                        </div>
                    </div>
                    <h3 className="font-medium text-sm truncate">{sermon.title}</h3>
                    <p className="text-xs text-slate-400">{sermon.preacher}</p>
                    </div>
                ))}
                </div>
            </div>
            ))}
        </div>
        </>
      )}

      {activeTab === 'praise' && (
          <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {songs.map(song => (
                      <div 
                        key={song.id} 
                        className="bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:bg-slate-700 transition-colors group"
                        onClick={() => setSelectedSong(song)}
                      >
                          <div className="aspect-square relative">
                              <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Play size={24} fill="white" className="text-white" />
                                  </div>
                              </div>
                          </div>
                          <div className="p-4">
                              <h3 className="font-bold text-white truncate">{song.title}</h3>
                              <p className="text-sm text-slate-400 truncate">{song.artist}</p>
                              <div className="flex items-center text-xs text-slate-500 mt-2 space-x-1">
                                  <Music size={12} />
                                  <span>{song.album}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

    </div>
  );
};

export default SermonView;