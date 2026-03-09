"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Copy, FileText, Settings, PanelLeft } from 'lucide-react';

interface ChatWindowProps {
    messages: any[];
    onSendMessage: (msg: string) => void;
    isStreaming: boolean;
    toggleSidebar: () => void;
}

export default function ChatWindow({ messages, onSendMessage, isStreaming, toggleSidebar }: ChatWindowProps) {
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isStreaming]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#09090b]">

            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10 w-full">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
                        <PanelLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-[#8b5cf6]" />
                        <span className="font-semibold text-white tracking-wide">NeuroChat <span className="text-xs px-2 py-0.5 ml-2 rounded bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/20">GPT-4o</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Settings size={18} />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar relative">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Sparkles size={64} className="text-[#8b5cf6] mb-6 opacity-80" />
                        <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
                        <p className="text-sm max-w-md mx-auto">Upload a document, ask a complex coding question, or spark a creative brainstorm.</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} max-w-4xl mx-auto w-full`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                        <Bot size={18} className="text-white" />
                                    </div>
                                )}

                                <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-tr-sm border border-white/5'
                                        : 'bg-transparent text-gray-200'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>

                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                                            <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                                                <Copy size={12} /> Copy
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                                        <User size={16} className="text-gray-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                <div ref={endOfMessagesRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-[#09090b] to-transparent w-full">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2 bg-[#18181b] p-2 rounded-3xl border border-white/10 shadow-2xl focus-within:border-[#8b5cf6]/50 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all">
                    <button type="button" className="p-3 text-gray-400 hover:text-[#3b82f6] transition-colors rounded-full hover:bg-white/5">
                        <FileText size={20} />
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Send a message to NeuroChat..."
                        className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[44px] py-3 px-2 text-white placeholder-gray-500 custom-scrollbar"
                        rows={1}
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || isStreaming}
                        className={`p-3 rounded-full flex items-center justify-center transition-all ${input.trim() && !isStreaming
                                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] cursor-pointer hover:scale-105'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isStreaming ? (
                            <div className="w-5 h-5 flex items-center justify-center gap-1">
                                <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        ) : (
                            <Send size={18} className="translate-x-0.5" />
                        )}
                    </button>
                </form>
                <p className="text-center text-xs text-gray-600 mt-4">
                    NeuroChat AI can make mistakes. Consider verifying important information.
                </p>
            </div>

        </div>
    );
}
