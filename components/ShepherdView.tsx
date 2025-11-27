import React, { useState, useRef, useEffect } from 'react';
import { getShepherdAdvice } from '../services/geminiService';
import { User } from '../types';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';

interface ShepherdViewProps {
  user: User;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
}

const ShepherdView: React.FC<ShepherdViewProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
      { role: 'ai', content: `Peace be with you, ${user.name.split(' ')[0]}. I am your digital spiritual guide. How is your spirit today? You can ask me for a verse, prayer, or guidance.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const advice = await getShepherdAdvice(userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', content: advice }]);
    setLoading(false);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col md:pl-64">
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm flex items-center space-x-3">
         <div className="bg-indigo-100 p-2 rounded-full">
            <Bot size={24} className="text-indigo-600" />
         </div>
         <div>
             <h2 className="font-bold text-slate-800">The AI Shepherd</h2>
             <p className="text-xs text-slate-500">Biblical Guidance • Always Available</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-amber-100 ml-2' : 'bg-indigo-100 mr-2'}`}>
                        {msg.role === 'user' ? <UserIcon size={16} className="text-amber-600" /> : <Bot size={16} className="text-indigo-600" />}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-line ${
                        msg.role === 'user' 
                        ? 'bg-amber-500 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                        {msg.content}
                    </div>
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center space-x-2 ml-10">
                     <Loader2 className="animate-spin text-indigo-500" size={16} />
                     <span className="text-xs text-slate-400">Meditating on the word...</span>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 mb-16 md:mb-0">
          <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2">
              <input 
                type="text" 
                className="flex-1 bg-transparent focus:outline-none text-sm"
                placeholder="Ask for a verse for anxiety..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend} 
                disabled={loading || !input}
                className="bg-indigo-600 p-2 rounded-full text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
              >
                  <Send size={16} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default ShepherdView;
