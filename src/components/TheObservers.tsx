import React, { useState, useRef, useEffect } from 'react';
import { CENTRAL_CONFIG } from '../config/centralConfig';
import { Sigil444 } from './Sigil444';
import { audioSystem } from '../utils/audioSystem';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const TheObservers: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'CARRIER 444.40 MHz OPEN. The observer acknowledges your presence. State your query before the 04:44 window closes.',
      timestamp: '04:44:12',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    audioSystem.playClick();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      // Call server-side Gemini endpoint
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Signal lost');
      }

      const data = await response.json();
      audioSystem.playMorseTone(444, 100);

      const botMsg: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: data.reply || 'SIGNAL INTERRUPTION // STATIC // WAIT FOR THE SECOND SIGNAL.',
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      audioSystem.playStaticBurst(0.2, 0.05);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'CARRIER WEAK... "The transmission frequency is fading into the snow. The answer lies within the fourteen pieces."',
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-24">
      
      {/* Header Bar */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                OBSERVERS NETWORK
              </span>
              <span className="text-[#60676E]">·</span>
              <span className="text-[10px] text-[#7E858D] tracking-widest">
                RECOVERED CHANNELS &amp; FREQUENCY CONTACT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white phosphor-text">
              THE OBSERVERS
            </h2>
          </div>

          <div className="text-xs text-[#7E858D]">
            <span>COORDINATES: {CENTRAL_CONFIG.PRIMARY_COORDINATES}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* Core Narrative Text */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <Sigil444 size={56} interactive={true} className="mx-auto text-white/90" />
          
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-[0.2em] text-white phosphor-text">
              OBSERVERS NETWORK
            </h3>
            <p className="text-xs sm:text-sm text-[#9BA1A6] leading-relaxed">
              Someone noticed the signal.<br />
              Then someone else did.<br />
              <span className="text-white font-medium">Now you’re here.</span>
            </p>
          </div>
        </div>

        {/* Recovered Social Channels (Story Integrated) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Channel 1: X Signal Channel */}
          <a
            href={CENTRAL_CONFIG.X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 border border-[#181C20] bg-[#050608] hover:border-[#252A2E] hover:bg-[#090C0F] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] text-[#7E858D]">
                <span>BROADCAST 01</span>
                <span className="text-red-500 font-bold group-hover:animate-pulse">OPEN</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                X SIGNAL CHANNEL
              </h4>
              <p className="text-xs text-[#7E858D] leading-relaxed">
                Public frequency feeds, anomaly alerts, and cryptic transmission updates.
              </p>
            </div>
            <div className="pt-4 border-t border-[#111519] flex justify-between items-center text-[10px] text-[#60676E] group-hover:text-white">
              <span>four444four44</span>
              <span>[ CONNECT &rarr; ]</span>
            </div>
          </a>

          {/* Channel 2: Telegram Private Transmission */}
          <a
            href={CENTRAL_CONFIG.TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 border border-[#181C20] bg-[#050608] hover:border-[#252A2E] hover:bg-[#090C0F] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] text-[#7E858D]">
                <span>BROADCAST 02</span>
                <span className="text-red-500 font-bold group-hover:animate-pulse">ACTIVE</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                TELEGRAM PRIVATE TRANSMISSION
              </h4>
              <p className="text-xs text-[#7E858D] leading-relaxed">
                Direct observer communications, cipher decodes, and manual puzzle verification links.
              </p>
            </div>
            <div className="pt-4 border-t border-[#111519] flex justify-between items-center text-[10px] text-[#60676E] group-hover:text-white">
              <span>four444four44four4</span>
              <span>[ CONNECT &rarr; ]</span>
            </div>
          </a>

          {/* Channel 3: TikTok Recovered Footage */}
          <a
            href={CENTRAL_CONFIG.TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 border border-[#181C20] bg-[#050608] hover:border-[#252A2E] hover:bg-[#090C0F] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] text-[#7E858D]">
                <span>BROADCAST 03</span>
                <span className="text-red-500 font-bold group-hover:animate-pulse">CAPTURED</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                TIKTOK RECOVERED FOOTAGE
              </h4>
              <p className="text-xs text-[#7E858D] leading-relaxed">
                Found VHS tapes, audio recordings from 04:44, and night surveillance scans.
              </p>
            </div>
            <div className="pt-4 border-t border-[#111519] flex justify-between items-center text-[10px] text-[#60676E] group-hover:text-white">
              <span>four444four44four4</span>
              <span>[ CONNECT &rarr; ]</span>
            </div>
          </a>

        </div>

        {/* Gemini-Powered Multi-Turn OBSERVER TERMINAL Chat */}
        <div className="border border-[#252A2E] bg-[#050608] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Terminal Title Bar */}
          <div className="px-5 py-3 border-b border-[#181C20] bg-[#090C0F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs text-white font-semibold tracking-wider">
                FREQUENCY CONTACT // THE OBSERVER CONVERSATION
              </span>
            </div>
            <span className="text-[10px] text-[#7E858D] font-mono">
              CHANNEL: 444.40 MHz · MULTI-TURN
            </span>
          </div>

          {/* Scrollable Message Thread */}
          <div
            ref={chatScrollRef}
            className="p-4 sm:p-6 h-80 sm:h-96 overflow-y-auto space-y-4 bg-black/95 scanlines"
          >
            {messages.map((msg) => {
              const isObserver = msg.role === 'model';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isObserver ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[9px] text-[#60676E]">
                    <span>{isObserver ? 'THE OBSERVER (UNKNOWN SOURCE)' : 'INVESTIGATOR (LOCAL)'}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3 text-xs leading-relaxed font-mono ${
                      isObserver
                        ? 'border border-[#252A2E] bg-[#090C0F] text-[#D6D9DC] phosphor-text'
                        : 'border border-red-900/60 bg-red-950/20 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex flex-col items-start space-y-1">
                <span className="text-[9px] text-[#60676E]">INTERCEPTING RESPONSE...</span>
                <div className="p-3 border border-[#181C20] bg-[#090C0F] text-xs text-[#7E858D] animate-pulse">
                  &gt; TRANSCRIBING HARMONIC CARRIER...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Field */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#181C20] bg-[#090C0F] flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Transmit message to The Observer..."
              disabled={loading}
              className="flex-1 bg-black border border-[#181C20] px-4 py-2.5 text-xs text-white placeholder-[#60676E] focus:border-[#7E858D] outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-2.5 border border-[#252A2E] bg-[#111519] text-xs uppercase tracking-widest text-white hover:border-[#7E858D] disabled:opacity-40 transition-colors cursor-pointer"
            >
              TRANSMIT
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
