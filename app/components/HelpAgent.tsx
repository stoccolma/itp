'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function HelpAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 bg-[var(--card)] text-zinc-50 text-[var(--ink)] rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
        aria-label="Open help chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] bg-white bg-[var(--paper)] rounded-2xl shadow-2xl border border-zinc-200 border-[var(--line)] flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 border-[var(--line)]">
            <h3 className="font-semibold text-zinc-900 text-[var(--ink)]">Sicily Planner Help</h3>
            <p className="text-sm text-zinc-600 text-[var(--ink)]/60 mt-1">
              Ask about using the planner or finding places.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-[var(--ink)]/60 text-sm">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Ask me anything about:</p>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• Using the day planner</li>
                  <li>• Finding places to visit</li>
                  <li>• Map navigation tips</li>
                  <li>• Itinerary suggestions</li>
                </ul>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-zinc-900 bg-[var(--card)] text-zinc-50 text-[var(--ink)]'
                      : 'bg-zinc-100 text-zinc-900 text-[var(--ink)]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-zinc-200 border-[var(--line)]">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 border-[var(--line)] bg-white text-zinc-900 text-[var(--ink)] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-zinc-900 bg-[var(--card)] text-zinc-50 text-[var(--ink)] rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-zinc-500 text-[var(--ink)]/60 mt-2">
              Your messages are not used to train anything; they only help answer your question.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
