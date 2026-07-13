import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Image as ImageIcon, CheckCheck, Smile, Search, PanelLeft, Bot } from 'lucide-react';
import { Conversation, Artist, Message } from '../types';

interface MessagesViewProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (convoId: string, text: string) => void;
  onArtistClick: (id: string) => void;
}

export default function MessagesView({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onArtistClick
}: MessagesViewProps) {

  const [inputText, setInputText] = useState('');
  const [convoSearchQuery, setConvoSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find(c => c.id === activeConversationId);

  // Filter conversations list by partner name
  const filteredConversations = conversations.filter(c => 
    c.artist.name.toLowerCase().includes(convoSearchQuery.toLowerCase()) ||
    c.artist.username.toLowerCase().includes(convoSearchQuery.toLowerCase())
  );

  // Auto scroll chat list on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo?.messages?.length]);

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    onSendMessage(activeConversationId, inputText);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-[#0d0d12]/50 border border-white/5 rounded-3xl overflow-hidden flex animate-fade-in shadow-2xl" id="messages-split-panel">
      
      {/* Left Column: Conversations Listing (35% width desktop) */}
      <div className="w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-[#0c0c11]/85 select-none" id="messages-sidebar">
        
        {/* Search header list */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <h3 className="font-display font-semibold text-white text-base">Direct Messages</h3>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-gray-500" />
            <input
              id="messages-convo-search"
              type="text"
              placeholder="Filter conversations..."
              value={convoSearchQuery}
              onChange={(e) => setConvoSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>
        </div>

        {/* Conversations Scroll List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.map((convo) => {
            const lastMsg = convo.messages[convo.messages.length - 1];
            const isActive = activeConversationId === convo.id;
            
            return (
              <div
                key={convo.id}
                id={`convo-item-${convo.id}`}
                onClick={() => onSelectConversation(convo.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600/15 to-purple-600/5 border border-violet-500/10 shadow-sm shadow-violet-500/5' 
                    : 'hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                {/* Avatar status circle */}
                <div className="relative">
                  <img
                    src={convo.artist.avatar}
                    alt={convo.artist.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c0c11]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-white truncate">{convo.artist.name}</p>
                    <span className="text-[9px] text-gray-500 font-mono font-medium">{lastMsg?.timestamp || ''}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-400 truncate pr-2">
                      {lastMsg ? lastMsg.content : 'No messages yet.'}
                    </p>
                    
                    {convo.unreadCount > 0 && (
                      <span className="bg-violet-600 text-white text-[9px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full shrink-0">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredConversations.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-xs italic">
              No conversations match.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Chat Window active stream (65% width) */}
      <div className="flex-1 flex flex-col bg-[#0f0f14]/40" id="messages-chat-window">
        {activeConvo ? (
          <>
            {/* Active partner top status bar */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0e0e14]/80 select-none" id="chat-header">
              <div 
                onClick={() => onArtistClick(activeConvo.artist.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={activeConvo.artist.avatar}
                  alt={activeConvo.artist.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-violet-500 transition-colors"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{activeConvo.artist.name}</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Online
                  </p>
                </div>
              </div>

              {/* Bot simulation indicator */}
              <div className="flex items-center gap-1 text-[10px] font-mono bg-violet-950/40 border border-violet-500/20 text-violet-400 px-3 py-1.5 rounded-full">
                <Bot className="w-3.5 h-3.5 animate-bounce" />
                <span>Simulated Chat Partner</span>
              </div>
            </div>

            {/* Message bubble thread stream */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" id="chat-thread">
              {activeConvo.messages.map((msg) => {
                const isMe = msg.senderId === 'user-current';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex gap-2.5 max-w-[70%] items-end">
                      {!isMe && (
                        <img
                          src={activeConvo.artist.avatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-white/5 self-end shrink-0"
                        />
                      )}
                      
                      <div className="space-y-1">
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                            isMe 
                              ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white rounded-br-none' 
                              : 'bg-[#121218] text-gray-300 border border-white/5 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>

                          {/* Image attachments support */}
                          {msg.imageUrl && (
                            <div className="mt-3.5 rounded-lg overflow-hidden border border-white/10 w-44 aspect-square">
                              <img src={msg.imageUrl} alt="attachment" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>

                        {/* Timestamp tick row */}
                        <div className={`flex items-center gap-1.5 text-[9px] font-mono text-gray-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-violet-400" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Submission Footer Form */}
            <form onSubmit={handleSendSubmit} className="p-4 bg-[#0e0e14]/80 border-t border-white/5 flex gap-3 items-center" id="chat-input-form">
              {/* Media attach shortcut icon button */}
              <button
                type="button"
                id="btn-chat-attach-media"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all"
                title="Mock attach file"
              >
                <ImageIcon className="w-4.5 h-4.5" />
              </button>

              <div className="flex-1 relative flex items-center">
                <input
                  id="chat-text-input"
                  type="text"
                  placeholder={`Write a message to ${activeConvo.artist.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                />
                
                {/* Smiley/emoji shortcut */}
                <button
                  type="button"
                  id="btn-chat-emoji"
                  className="absolute right-4 text-gray-500 hover:text-gray-300 transition-all"
                >
                  <Smile className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                id="btn-chat-send"
                className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white shadow-lg transition-all"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </>
        ) : (
          /* Empty Active Chat view state */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" id="empty-chat-placeholder">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
              <Bot className="w-6 h-6 text-violet-400" />
            </div>
            <h4 className="font-display font-semibold text-white">Select a Chat Conversation</h4>
            <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
              Choose one of our talented artists on the left menu, or visit an artist profile to spark a simulated workshop discussion!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
