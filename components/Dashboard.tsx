import React, { useState } from 'react';
import { User, PrayerRequest } from '../types';
import { Bell, ShieldCheck, Sun, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  prayerRequests: PrayerRequest[];
  onAddPrayerRequest: (request: PrayerRequest) => void;
  onDeletePrayerRequest: (id: string) => void;
  onTogglePrayerStatus: (id: string) => void;
  setView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    user, 
    prayerRequests, 
    onAddPrayerRequest, 
    onDeletePrayerRequest, 
    onTogglePrayerStatus,
    setView 
}) => {
  const [newRequest, setNewRequest] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmitRequest = () => {
      if(!newRequest.trim()) return;
      
      const request: PrayerRequest = {
          id: Date.now().toString(),
          content: newRequest,
          isPrivate: false, // Defaulting to public for demo community feel
          author: isAnonymous ? "Anonymous" : user.name,
          prayedCount: 0,
          status: 'active',
          createdAt: new Date()
      };
      onAddPrayerRequest(request);
      setNewRequest("");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pl-64">
      {/* Header */}
      <header className="bg-white p-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good Morning, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm">Welcome to Jesus Christ is Lord</p>
        </div>
        <div className="flex space-x-3">
            <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-amber-600">{user.sanctityPoints} SP</span>
                <span className="text-[10px] text-slate-400">{user.tier}</span>
            </div>
            <div className="p-2 bg-slate-100 rounded-full relative">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
        </div>
      </header>

      <div className="p-6 space-y-8 max-w-5xl mx-auto">
        {/* Watch Live CTA */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center cursor-pointer transform hover:scale-[1.01] transition-transform" onClick={() => setView('sermons')}>
           <div>
              <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold mb-2 inline-block">LIVE NOW</span>
              <h2 className="text-2xl font-bold mb-1">Sunday Service: The Power of Faith</h2>
              <p className="text-white/80 text-sm">Pastor Chiwenga • Harare Central</p>
           </div>
           <div className="bg-white text-orange-600 rounded-full p-3 shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                 <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
               </svg>
           </div>
        </div>

        {/* Verse of the Day */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
           <div className="relative h-48">
              <img src="https://picsum.photos/seed/bible/800/400" className="w-full h-full object-cover" alt="Bible Study" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
                 <div>
                    <h3 className="text-white font-serif text-xl italic mb-2">"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles."</h3>
                    <p className="text-white/80 font-bold text-sm uppercase tracking-widest">Isaiah 40:31</p>
                 </div>
              </div>
           </div>
           <div className="p-4 flex justify-between items-center">
              <span className="text-slate-500 text-sm">Daily Manna</span>
              <button className="text-amber-600 text-sm font-semibold hover:underline">Read Devotional</button>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           {/* Prayer Wall */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-slate-800">Community Prayer Wall</h3>
                  <span className="text-xs text-slate-500">{prayerRequests.length} requests</span>
              </div>
              
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 no-scrollbar">
                  {/* Add New */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <textarea 
                          className="w-full bg-transparent text-sm focus:outline-none mb-2" 
                          placeholder="Share a prayer request..."
                          rows={2}
                          value={newRequest}
                          onChange={(e) => setNewRequest(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                          <label className="flex items-center space-x-2 text-xs text-slate-500 cursor-pointer">
                              <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                              <span>Post anonymously</span>
                          </label>
                          <button onClick={handleSubmitRequest} className="bg-amber-500 text-white px-3 py-1 rounded text-xs font-bold">Post</button>
                      </div>
                  </div>

                  {prayerRequests.map(req => (
                      <div key={req.id} className={`p-3 rounded-lg border ${req.status === 'answered' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 shadow-sm'}`}>
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                  <span className="font-bold text-sm text-slate-700">{req.author}</span>
                                  {req.status === 'answered' && <span className="text-[10px] bg-green-200 text-green-800 px-1 rounded">ANSWERED</span>}
                              </div>
                              <div className="flex space-x-1">
                                  {req.author === user.name && (
                                      <>
                                          <button onClick={() => onTogglePrayerStatus(req.id)} className="text-green-600 hover:text-green-800" title="Mark Answered"><CheckCircle2 size={16}/></button>
                                          <button onClick={() => onDeletePrayerRequest(req.id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={16}/></button>
                                      </>
                                  )}
                              </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{req.content}</p>
                          <button className="flex items-center space-x-1 text-slate-400 hover:text-amber-500 text-xs transition-colors">
                              <Sun size={14} />
                              <span>{req.prayedCount} prayed</span>
                          </button>
                      </div>
                  ))}
              </div>
           </div>

           {/* Quick Tools */}
           <div className="space-y-6">
                {/* AI Shepherd Promo */}
                <div 
                    className="bg-indigo-900 rounded-xl p-6 text-white relative overflow-hidden cursor-pointer hover:bg-indigo-800 transition-colors"
                    onClick={() => setView('shepherd')}
                >
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Talk to the Shepherd</h3>
                        <p className="text-indigo-200 text-sm">Get biblical guidance and counsel instantly.</p>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full opacity-20"></div>
                </div>

                {/* Kids Kingdom Promo */}
                <div 
                    className="bg-sky-500 rounded-xl p-6 text-white relative overflow-hidden cursor-pointer hover:bg-sky-600 transition-colors"
                    onClick={() => setView('kids')}
                >
                     <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-1">Kids' Kingdom</h3>
                        <p className="text-sky-100 text-sm">Generate biblical stories for your little ones.</p>
                    </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;