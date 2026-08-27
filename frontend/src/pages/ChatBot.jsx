import React, { useEffect, useState, useRef } from 'react';
import { useField } from '../context/FieldContext';
import { chatAPI } from '../services/api';
import { Send, Bot, User, Leaf, Zap, Droplets, Trash2, TrendingUp, ShoppingBag, Layers, HelpCircle } from 'lucide-react';

const renderFormattedText = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let keyIdx = 0;

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const headerRow = tableRows[0];
    const dataRows = tableRows.slice(2);
    
    elements.push(
      <div key={`table-${keyIdx++}`} style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
          <thead>
            <tr style={{ background: 'rgba(34, 197, 94, 0.2)', borderBottom: '1px solid var(--border-glass)' }}>
              {headerRow.split('|').filter(c => c.trim()).map((cell, idx) => (
                <th key={idx} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((rowStr, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                {rowStr.split('|').filter(c => c.trim()).map((cell, cIdx) => (
                  <td key={cIdx} style={{ padding: '0.5rem 0.75rem', color: 'var(--text-primary)' }}>
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      tableRows.push(trimmed);
    } else {
      if (inTable) flushTable();
      if (trimmed) {
        // Render bold text
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const parsedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        elements.push(
          <div key={`line-${keyIdx++}`} style={{ marginBottom: '0.35rem', lineHeight: 1.6 }}>
            {parsedLine}
          </div>
        );
      } else {
        elements.push(<div key={`br-${keyIdx++}`} style={{ height: '0.4rem' }} />);
      }
    }
  });
  if (inTable) flushTable();

  return elements;
};

const ChatBot = () => {
  const { selectedField } = useField();
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hello! I am DHARA AI. I have real-time access to your field's live sensor data, soil NPK levels, weather forecasts, and live mandi market prices. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) headerTitle.textContent = 'DHARA AI Assistant';
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e, textToSend = null) => {
    e?.preventDefault();
    const queryText = (textToSend || input).trim();
    if (!queryText || isTyping) return;

    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: queryText }]);
    setIsTyping(true);

    try {
      const res = await chatAPI.send(queryText, selectedField?.id);
      if (res && res.data && res.data.reply) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: res.data.reply }]);
      } else {
        throw new Error("No response reply");
      }
    } catch (err) {
      console.error("Chat API call failed:", err);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "I am having trouble connecting to the backend. Please check that the server is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { id: Date.now(), role: 'ai', text: "Conversation cleared. How can I help you optimize your farm today?" }
    ]);
  };

  const suggestions = [
    { label: "How is my field right now?", icon: HelpCircle },
    { label: "Should I irrigate today?", icon: Droplets },
    { label: "My phosphorus is low. What should I do?", icon: Zap },
    { label: "Compare DAP and NPK 12-32-16 fertilizers.", icon: Layers },
    { label: "What is today's wheat price near me?", icon: TrendingUp },
    { label: "Which nearby market is better?", icon: ShoppingBag },
    { label: "Considering my field data and weather, what should I do today?", icon: Leaf }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      
      {/* Chat Interface */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>DHARA AI Agricultural & Mandi Advisor</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedField ? `Active Field: ${selectedField.name} (${selectedField.crop_type || 'Wheat'})` : 'Global Agronomic Assistant'}
              </p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            style={{ background: 'none', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', borderRadius: '6px', padding: '0.35rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
            title="Clear Chat History"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>

        {/* Messages Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              {msg.role === 'ai' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Leaf size={20} color="#fff" />
                </div>
              )}
              
              <div style={{ 
                background: msg.role === 'user' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-glass)'}`,
                padding: '1rem 1.25rem', borderRadius: '12px',
                borderTopRightRadius: msg.role === 'user' ? 0 : '12px',
                borderTopLeftRadius: msg.role === 'ai' ? 0 : '12px',
                color: 'var(--text-primary)',
                fontSize: '0.925rem'
              }}>
                {renderFormattedText(msg.text)}
              </div>

              {msg.role === 'user' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={20} color="var(--text-secondary)" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={20} color="#fff" />
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', padding: '1rem 1.25rem', borderRadius: '12px', borderTopLeftRadius: 0, display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '4px' }}>Analyzing field sensors & data...</span>
                <span className="dot" style={{ width: 6, height: 6, background: 'var(--accent-primary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                <span className="dot" style={{ width: 6, height: 6, background: 'var(--accent-primary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                <span className="dot" style={{ width: 6, height: 6, background: 'var(--accent-primary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your field, NPK, irrigation, fertilizer comparison, or mandi prices..."
              style={{ flex: 1, paddingRight: '3rem', fontSize: '0.95rem' }}
              maxLength={2000}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              style={{
                position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                background: input.trim() && !isTyping ? 'var(--accent-primary)' : 'transparent',
                border: 'none', width: '36px', height: '36px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: input.trim() && !isTyping ? '#fff' : 'var(--text-muted)', 
                cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                transition: 'var(--transition)'
              }}
            >
              <Send size={18} />
            </button>
          </form>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
            {input.length}/2000
          </div>
        </div>
      </div>

      {/* Context & Suggested Questions Panel */}
      <div className="glass-card" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={18} color="var(--accent-primary)" /> AI Capabilities
          </h3>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Queries real-time 7-in-1 NPK & moisture sensors</li>
            <li>Evaluates weather & irrigation timing</li>
            <li>Compares fertilizer NPK ratios & costs</li>
            <li>Fetches live mandi market prices & nearby shops</li>
          </ul>
        </div>

        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Suggested Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {suggestions.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <button 
                  key={idx}
                  className="btn-secondary" 
                  style={{ fontSize: '0.78rem', textAlign: 'left', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                  onClick={() => handleSend(null, s.label)}
                  disabled={isTyping}
                >
                  <IconComp size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @media (max-width: 950px) {
          .fade-in { flex-direction: column; height: auto; }
          .glass-card:last-child { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
