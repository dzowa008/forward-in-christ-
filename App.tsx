import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SermonView from './components/SermonView';
import FeedView from './components/FeedView';
import CommunityView from './components/CommunityView';
import ShepherdView from './components/ShepherdView';
import KidsView from './components/KidsView';
import { MOCK_USER, MOCK_SERMONS, MOCK_SHORTS, MOCK_GROUPS, MOCK_MESSAGES, MOCK_PRAYER_REQUESTS, MOCK_SONGS, MOCK_CONTACTS } from './constants';
import { Note, PrayerRequest, ChatGroup, ChatMessage, Contact } from './types';

function App() {
  const [currentView, setCurrentView] = useState('home');
  
  // App State "Database"
  const [user] = useState(MOCK_USER);
  const [notes, setNotes] = useState<Note[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(MOCK_PRAYER_REQUESTS);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(MOCK_GROUPS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [songs] = useState(MOCK_SONGS);

  const chatGroupsRef = useRef(chatGroups);

  // Keep ref synced for interval
  useEffect(() => {
    chatGroupsRef.current = chatGroups;
  }, [chatGroups]);

  // CRUD Handlers
  const addNote = (note: Note) => setNotes(prev => [note, ...prev]);
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  const addPrayerRequest = (req: PrayerRequest) => setPrayerRequests(prev => [req, ...prev]);
  const deletePrayerRequest = (id: string) => setPrayerRequests(prev => prev.filter(p => p.id !== id));
  const togglePrayerStatus = (id: string) => {
    setPrayerRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: req.status === 'active' ? 'answered' : 'active' } : req
    ));
  };

  const createGroup = (name: string, members: string[]) => {
      const newGroup: ChatGroup = {
          id: Date.now().toString(),
          name,
          type: 'general',
          image: `https://picsum.photos/seed/${name}/100/100`,
          lastMessage: 'Group created',
          lastMessageTime: 'Just now',
          unreadCount: 0,
          members: [user.id, ...members]
      };
      setChatGroups(prev => [newGroup, ...prev]);
  };

  const sendMessage = (groupId: string, text: string, videoUrl?: string) => {
      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          groupId,
          senderId: user.id,
          senderName: user.name,
          text,
          timestamp: new Date(),
          isMe: true,
          video: videoUrl
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Update group last message (Mock)
      const lastMsgText = videoUrl ? '📹 Video' : text;
      setChatGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, lastMessage: `You: ${lastMsgText}`, lastMessageTime: 'Just now', unreadCount: 0 } : g
      ));
  };

  const markGroupAsRead = (groupId: string) => {
      setChatGroups(prev => prev.map(g => 
          g.id === groupId ? { ...g, unreadCount: 0 } : g
      ));
  };

  // Simulate incoming messages for notification demo
  useEffect(() => {
    const interval = setInterval(() => {
        const groups = chatGroupsRef.current;
        if (groups.length === 0) return;

        // Pick random group and sender
        const targetGroup = groups[Math.floor(Math.random() * groups.length)];
        const senders = ['Pastor Chiwenga', 'Sister Rudo', 'Elder Banda', 'Chipo', 'Blessing'];
        const senderName = senders[Math.floor(Math.random() * senders.length)];
        const messagesTexts = [
            "Praise God! See you all on Sunday.",
            "Can someone share the notes from yesterday?",
            "Sending prayers for the family.",
            "The worship practice has been moved to 6 PM.",
            "Amen!",
            "Who is leading intercession today?"
        ];
        const text = messagesTexts[Math.floor(Math.random() * messagesTexts.length)];

        const incomingMsg: ChatMessage = {
            id: Date.now().toString(),
            groupId: targetGroup.id,
            senderId: 'simulated',
            senderName,
            text,
            timestamp: new Date(),
            isMe: false
        };

        setMessages(prev => [...prev, incomingMsg]);

        setChatGroups(prev => prev.map(g => {
            if (g.id === targetGroup.id) {
                return {
                    ...g,
                    lastMessage: `${senderName}: ${text}`,
                    lastMessageTime: 'Just now',
                    unreadCount: (g.unreadCount || 0) + 1
                };
            }
            return g;
        }));

    }, 20000); // Trigger every 20 seconds

    return () => clearInterval(interval);
  }, []);

  // Render Logic
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard 
                  user={user} 
                  prayerRequests={prayerRequests}
                  onAddPrayerRequest={addPrayerRequest}
                  onDeletePrayerRequest={deletePrayerRequest}
                  onTogglePrayerStatus={togglePrayerStatus}
                  setView={setCurrentView}
               />;
      case 'sermons':
        return <SermonView 
                  sermons={MOCK_SERMONS} 
                  songs={songs}
                  notes={notes}
                  onAddNote={addNote}
                  onDeleteNote={deleteNote}
               />;
      case 'feed':
        return <FeedView shorts={MOCK_SHORTS} />;
      case 'community':
        return <CommunityView 
                  groups={chatGroups} 
                  messages={messages} 
                  contacts={contacts}
                  currentUser={user}
                  onSendMessage={sendMessage}
                  onCreateGroup={createGroup}
                  onMarkAsRead={markGroupAsRead}
               />;
      case 'shepherd':
        return <ShepherdView user={user} />;
      case 'kids':
        return <KidsView />;
      case 'profile':
        return (
            <div className="min-h-screen bg-white md:pl-64 p-8 flex flex-col items-center justify-center text-center">
                <img src={user.avatar} className="w-32 h-32 rounded-full mb-4" alt="Profile" />
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-slate-500 mb-6">{user.churchBranch}</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="bg-slate-100 p-4 rounded-xl">
                        <span className="block text-2xl font-bold text-amber-600">{user.streakDays}</span>
                        <span className="text-sm text-slate-500">Day Streak</span>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-xl">
                        <span className="block text-2xl font-bold text-amber-600">{user.sanctityPoints}</span>
                        <span className="text-sm text-slate-500">Sanctity Points</span>
                    </div>
                </div>
            </div>
        );
      default:
        return <Dashboard 
                  user={user} 
                  prayerRequests={prayerRequests}
                  onAddPrayerRequest={addPrayerRequest}
                  onDeletePrayerRequest={deletePrayerRequest}
                  onTogglePrayerStatus={togglePrayerStatus}
                  setView={setCurrentView}
               />;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen">
      <Navigation currentView={currentView} setView={setCurrentView} />
      <main className="w-full">
        {renderView()}
      </main>
    </div>
  );
}

export default App;