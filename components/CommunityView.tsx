import React, { useState, useRef, useEffect } from 'react';
import { ChatGroup, ChatMessage, User, Contact } from '../types';
import { Send, Image, Mic, MoreVertical, Plus, Users, Search, UserPlus, Phone, Check, Video, Loader2, ArrowLeft, Bell } from 'lucide-react';

interface CommunityViewProps {
  groups: ChatGroup[];
  messages: ChatMessage[];
  contacts: Contact[];
  currentUser: User;
  onSendMessage: (groupId: string, text: string, videoUrl?: string) => void;
  onCreateGroup: (name: string, members: string[]) => void;
  onMarkAsRead: (groupId: string) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ groups, messages, contacts, currentUser, onSendMessage, onCreateGroup, onMarkAsRead }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [inputText, setInputText] = useState("");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, visible: boolean}>({message: '', visible: false});
  const prevGroups = useRef(groups);

  // Video Upload State
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock Friend Request State
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  // Watch for incoming messages to trigger notification
  useEffect(() => {
    groups.forEach(group => {
       const prevGroup = prevGroups.current.find(g => g.id === group.id);
       // If unread count increased
       if (prevGroup && group.unreadCount > prevGroup.unreadCount) {
           // If we are NOT in this group, show notification
           if (!selectedGroup || selectedGroup.id !== group.id) {
               setNotification({ message: `New message in ${group.name}`, visible: true });
               setTimeout(() => setNotification(n => ({...n, visible: false})), 4000);
           } else {
               // If we are in this group, mark as read immediately
               onMarkAsRead(group.id);
           }
       }
    });
    prevGroups.current = groups;
  }, [groups, selectedGroup, onMarkAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (selectedGroup) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedGroup]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedGroup) return;
    onSendMessage(selectedGroup.id, inputText);
    setInputText("");
  };

  const handleCreateGroup = () => {
      if(newGroupName.trim()){
          onCreateGroup(newGroupName, selectedMembers);
          setShowNewGroupModal(false);
          setNewGroupName("");
          setSelectedMembers([]);
      }
  };

  const toggleMemberSelection = (contactId: string) => {
      if (selectedMembers.includes(contactId)) {
          setSelectedMembers(prev => prev.filter(id => id !== contactId));
      } else {
          setSelectedMembers(prev => [...prev, contactId]);
      }
  };

  const sendFriendRequest = (contactId: string) => {
      setPendingRequests(prev => [...prev, contactId]);
  };

  const handleGroupSelect = (group: ChatGroup) => {
      setSelectedGroup(group);
      if (group.unreadCount > 0) {
          onMarkAsRead(group.id);
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedGroup) {
        setIsCompressing(true);
        // Simulate compression delay (WhatsApp style)
        setTimeout(() => {
            const url = URL.createObjectURL(file);
            onSendMessage(selectedGroup.id, "", url);
            setIsCompressing(false);
            if(fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }, 2000);
    }
  };

  const filteredMessages = selectedGroup 
    ? messages.filter(m => m.groupId === selectedGroup.id)
    : [];

  return (
    <div className="flex h-screen bg-slate-100 md:pl-64 pt-0 pb-16 md:pb-0 overflow-hidden relative">
      
      {/* Notification Toast */}
      {notification.visible && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-3 animate-bounce">
              <Bell size={20} className="text-amber-500" />
              <span className="text-sm font-medium">{notification.message}</span>
          </div>
      )}

      {/* Sidebar / List (Visible on mobile if no chat selected) */}
      <div className={`w-full md:w-80 bg-white border-r border-slate-200 flex flex-col ${selectedGroup ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Community</h2>
              <button onClick={() => setShowNewGroupModal(true)} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300">
                  <Plus size={20} className="text-slate-700" />
              </button>
           </div>
           
           {/* Tab Switcher */}
           <div className="flex bg-slate-200 rounded-lg p-1">
               <button 
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'chats' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                   Chats
               </button>
               <button 
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'contacts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                   People
               </button>
           </div>
        </div>

        {/* Search */}
        <div className="p-2">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input type="text" placeholder={activeTab === 'chats' ? "Search groups..." : "Search people..."} className="w-full bg-slate-100 p-2 pl-9 rounded-lg text-sm focus:outline-none" />
            </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' ? (
              groups.map(group => (
                <div 
                  key={group.id} 
                  onClick={() => handleGroupSelect(group)}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedGroup?.id === group.id ? 'bg-amber-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-full bg-slate-300 flex-shrink-0 overflow-hidden">
                      <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-slate-900 truncate">{group.name}</h3>
                        <span className="text-xs text-slate-400">{group.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                          <p className={`text-sm truncate w-4/5 ${group.unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                              {group.lastMessage}
                          </p>
                          {group.unreadCount > 0 && (
                              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                  {group.unreadCount}
                              </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
              // Contacts List
              <div className="p-2 space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 px-2 uppercase">Your Contacts</h3>
                  {contacts.map(contact => (
                      <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                          <div className="flex items-center space-x-3">
                              <div className="relative">
                                  <img src={contact.avatar} className="w-10 h-10 rounded-full" alt={contact.name} />
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${contact.status === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                              </div>
                              <div>
                                  <h4 className="font-semibold text-sm">{contact.name}</h4>
                                  <p className="text-xs text-slate-500">{contact.churchBranch}</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => sendFriendRequest(contact.id)}
                            className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
                          >
                              {pendingRequests.includes(contact.id) ? <Check size={18} className="text-green-600" /> : <UserPlus size={18} />}
                          </button>
                      </div>
                  ))}
                  <div className="mt-4 p-4 border-t border-slate-100 text-center">
                      <button className="text-amber-600 text-sm font-medium flex items-center justify-center space-x-2 w-full py-2 hover:bg-amber-50 rounded">
                          <Phone size={16} /> 
                          <span>Add from Phone Contacts</span>
                      </button>
                  </div>
              </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#e5ddd5] ${!selectedGroup ? 'hidden md:flex' : 'flex'}`}>
        {selectedGroup ? (
          <>
            {/* Header */}
            <div className="p-3 bg-white border-b border-slate-200 flex items-center shadow-sm">
              <button onClick={() => setSelectedGroup(null)} className="md:hidden mr-2">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden mr-3">
                <img src={selectedGroup.image} alt={selectedGroup.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{selectedGroup.name}</h3>
                <p className="text-xs text-slate-500">
                    {groups.find(g => g.id === selectedGroup.id)?.members?.length || 0} members
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg p-3 shadow-sm ${msg.isMe ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                    {!msg.isMe && <p className="text-xs font-bold text-orange-800 mb-1">{msg.senderName}</p>}
                    
                    {/* Video Rendering */}
                    {msg.video && (
                        <div className="mb-2 rounded-lg overflow-hidden bg-black/10">
                            <video src={msg.video} controls className="w-full max-h-[300px] object-contain" />
                        </div>
                    )}

                    {msg.text && <p className="text-sm text-slate-800 whitespace-pre-wrap">{msg.text}</p>}
                    <div className="text-[10px] text-slate-500 text-right mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-100 flex items-center space-x-2">
                {isCompressing ? (
                    <div className="flex-1 flex items-center justify-center space-x-2 text-slate-500 py-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm font-medium">Compressing video...</span>
                    </div>
                ) : (
                    <>
                        <button className="text-slate-500 p-2 hover:bg-slate-200 rounded-full transition-colors"><Plus size={24}/></button>
                        
                        {/* Video Upload Button */}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-slate-500 p-2 hover:bg-slate-200 rounded-full transition-colors"
                            title="Upload Video"
                        >
                            <Video size={24}/>
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="video/*" 
                            className="hidden" 
                            onChange={handleFileSelect}
                        />

                        <input 
                            type="text" 
                            className="flex-1 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                            placeholder="Type a message"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        {inputText ? (
                            <button onClick={handleSend} className="bg-amber-600 p-2 rounded-full text-white">
                                <Send size={20} />
                            </button>
                        ) : (
                            <button className="text-slate-500 p-2 hover:bg-slate-200 rounded-full transition-colors"><Mic size={24}/></button>
                        )}
                    </>
                )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mb-4">
               <Users size={48} />
            </div>
            <p>Select a group to start chatting</p>
          </div>
        )}
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="font-bold text-lg mb-4">Create New Group</h3>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Group Name (e.g. Youth Prayer)" 
                        className="w-full border p-2 rounded"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Add Participants</h4>
                        <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {contacts.map(contact => (
                                <div 
                                    key={contact.id} 
                                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${selectedMembers.includes(contact.id) ? 'bg-amber-100' : 'hover:bg-slate-50'}`}
                                    onClick={() => toggleMemberSelection(contact.id)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <img src={contact.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                                        <span className="text-sm">{contact.name}</span>
                                    </div>
                                    {selectedMembers.includes(contact.id) && <Check size={16} className="text-amber-600" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={() => setShowNewGroupModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                    <button onClick={handleCreateGroup} className="px-4 py-2 bg-amber-500 text-white rounded disabled:opacity-50" disabled={!newGroupName}>Create Group</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;