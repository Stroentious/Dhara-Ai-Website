import React, { useState, useRef, useEffect } from 'react';
import { QuickQuestionPills } from './QuickQuestionPills';
import { Bot, Send, User, Sparkles, RefreshCw } from 'lucide-react';

export const ChatWindow = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSelectQuestion = (q) => {
    onSendMessage(q);
  };

  return (
    <div className="agri-card flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-agri-800 flex items-center justify-between bg-slate-50 dark:bg-agri-900/60 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Dhara AI Agricultural Assistant</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400/80 font-medium">Phase 1 Mock Engine • Telemetry & Agronomic Knowledge</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Mock Agent Active
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-agri-900 border border-slate-200 dark:border-agri-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                    : 'bg-slate-50 dark:bg-agri-950/90 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-agri-850 rounded-tl-none space-y-1'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={i} className="text-slate-900 dark:text-white block font-bold mt-1">{line.replace(/\*\*/g, '')}</strong>;
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>
                <span className={`text-[10px] block mt-2 text-right ${isUser ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-agri-900 border border-slate-200 dark:border-agri-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 dark:bg-agri-950/90 border border-slate-200 dark:border-agri-850 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
              Querying farm telemetry & mock knowledge base...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Footer & Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-agri-800 bg-slate-50/50 dark:bg-agri-900/40 rounded-b-xl">
        <QuickQuestionPills onSelectQuestion={handleSelectQuestion} />

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about pole telemetry, soil moisture, pump status, or crop recommendations..."
            className="flex-1 bg-white dark:bg-agri-950 border border-slate-200 dark:border-agri-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/30"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
