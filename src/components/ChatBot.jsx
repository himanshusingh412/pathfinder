import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../utils/ai';

export default function ChatBot({ studentData, roadmapData, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: studentData.language === 'Hindi'
        ? `नमस्ते ${studentData.name}! मैं आपका AI करियर काउंसलर हूँ। आपके करियर और कॉलेज रोडमैप से संबंधित आपके किसी भी प्रश्न का उत्तर देने में मुझे खुशी होगी।`
        : `Hello ${studentData.name}! I am your AI career counselor. I'm here to help answer any questions you have about your personalized roadmap, colleges, exams, or next steps.`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');
    
    // Add user message to messages list
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const studentContext = JSON.stringify({ studentData, roadmapData });
      const response = await sendChatMessage(newMessages, studentContext);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: studentData.language === 'Hindi'
            ? `क्षमा करें, संदेश भेजने में समस्या हुई: ${err.message || 'त्रुटि'}। कृपया पुनः प्रयास करें।`
            : `Sorry, there was an issue getting a response: ${err.message || 'Error'}. Please try again.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parses URLs and makes them clickable
  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-400 hover:text-indigo-300 underline font-semibold break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-end print:hidden">
      {/* Backdrop closer */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="w-full sm:w-[460px] h-full bg-slate-900 border-l border-slate-800 flex flex-col relative shadow-2xl z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <h3 className="text-lg font-bold text-white">AI Counselor</h3>
            <p className="text-xs text-slate-400">Ask about your roadmap & career options</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
                }`}>
                  {isUser ? msg.content : renderMessageContent(msg.content)}
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3 flex space-x-1.5 items-center">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950/20 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={studentData.language === 'Hindi' ? "अपना सवाल पूछें..." : "Type your message..."}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-indigo-650 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-650 text-white p-3 rounded-xl transition-all shadow-md active:scale-[0.97]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>

      </div>
    </div>
  );
}
