import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export default function AIAssistant() {
  const { user } = useUserStore();
  const isIndustry = user?.role === 'Industry';
  const isGovernment = user?.role === 'Government' || user?.role === 'Admin';

  const getInitialMessage = () => {
    if (isIndustry) return "Hello! I'm your PrithviNet Compliance Advisor. I can help you analyze emission trends, predict violation risks, and interpret regulatory standards for your facility. How can I assist with your compliance goals today?";
    if (isGovernment) return "Greetings, Administrator. PrithviNet Intelligence is online. I'm ready to highlight non-compliant entities, identify regional hotspots, and suggest policy interventions based on current data. Which jurisdiction shall we analyze?";
    return "Hello! I'm your PrithviNet assistant. I can explain local pollution impacts on your health and guide you through environmental data. How can I help you stay informed and safe today?";
  };

  const getSuggestedPrompts = () => {
    if (isIndustry) return ['Violation risk forecast', 'Analyze stack B2', 'Compliance deadline', 'Mitigation plan'];
    if (isGovernment) return ['Identify hotspots', 'Compliance overview', 'Predict next breach', 'Export summary'];
    return ['AQI health impact', 'Report pollution', 'Compare cities', 'Stay safe tips'];
  };

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: getInitialMessage(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = {
        role: 'ai',
        content: data.reply,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        content: "I'm having trouble connecting to my brain modules. Please check if the local AI server is running." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-app text-text-primary font-display transition-colors duration-300">
      {/* Chat Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 py-6 md:py-10 w-full">
        <div className="flex flex-col gap-8 w-full">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'ai' ? 'bg-primary bg-opacity-20 text-primary border-primary border-opacity-30' : 'bg-panel border-border overflow-hidden'
              }`}>
                {msg.role === 'ai' ? (
                  <span className="material-symbols-outlined text-sm md:text-base">robot_2</span>
                ) : (
                  <img
                    alt="User avatar"
                    className="w-full h-full object-cover"
                    src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCg5ZF5U33Kx7ribuzFhzI-600z5JT2AHII4hHXUWK7m3qoCmcqjDOlUVByAGrRBnlVBCE2XX5H32xDEb0nia9sos7UcUNcumMeexIRs5cFKbaIB5zWJv03YRxTL1TuNnwc1KWnel7yJZT6ndEhN6DozWb_O9z4Y45VfcmHtShUpLYTxIjQHrnfOKTYnclRUHw0ms51rQkFJ1QuCusQTsxTOoZ7EYURh_7tCrlem3SnRO2NWes0bfvv9TKTjqIukgr2HmJabThPKYk"}
                  />
                )}
              </div>
              <div className={`space-y-2 flex flex-col max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <p className={`text-[10px] md:text-xs font-medium text-text-muted uppercase tracking-wider ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                  {msg.role === 'ai' ? 'Prithvi AI' : user?.name || 'Operator'}
                </p>
                <div className={`p-4 rounded-xl shadow-sm ${
                  msg.role === 'ai' 
                    ? 'bg-surface border border-border rounded-tl-none' 
                    : 'bg-primary text-background-dark rounded-tr-none shadow-md'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-4 animate-in fade-in duration-300">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center border border-primary border-opacity-30">
                <span className="material-symbols-outlined text-sm md:text-base">robot_2</span>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Bottom Interface - Part of normal flex flow */}
      <div className="p-4 md:p-6 bg-surface bg-opacity-50 backdrop-blur-md border-t border-border w-full shrink-0">
        <div className="w-full max-w-[1400px] mx-auto space-y-4 md:space-y-6">
          {/* Suggested Prompts */}
          <div className="flex flex-wrap gap-2 justify-center">
            {getSuggestedPrompts().map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                disabled={loading}
                className="text-[10px] md:text-xs font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-border hover:border-primary hover:bg-primary hover:bg-opacity-5 text-text-secondary hover:text-primary transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          {/* Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative group w-full"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors text-lg md:text-xl">auto_awesome</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full bg-surface border border-border rounded-xl py-3.5 md:py-4 pl-10 md:pl-12 pr-20 md:pr-24 focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary outline-none text-sm transition-all shadow-sm text-text-primary disabled:opacity-50"
              placeholder="Ask Prithvi..."
            />
            <div className="absolute inset-y-1.5 md:inset-y-2 right-1.5 md:right-2 flex items-center gap-1 md:gap-2">
              <button type="button" className="p-1.5 md:p-2 hover:bg-panel rounded-lg text-text-muted transition-all hidden sm:block">
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary hover:bg-opacity-90 text-background-dark rounded-lg px-3 md:px-4 h-full flex items-center justify-center gap-1.5 md:gap-2 transition-all shadow-lg shadow-primary disabled:opacity-50"
              >
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider hidden xs:block">
                  {loading ? '...' : 'Send'}
                </span>
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </form>
          {/* Status Footer */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[8px] md:text-[10px] font-medium text-text-muted uppercase tracking-widest truncate">System Ready</span>
            </div>
            <div className="text-[8px] md:text-[10px] text-text-muted text-right">
              Verify important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
