"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import { useAuth } from '@/lib/AuthContext';

// Simulated DB logic for frontend until full backend connect
type Message = { role: 'user' | 'assistant' | 'system'; content: string };
type Chat = { id: string; title: string };

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chats, setChats] = useState<Chat[]>([
        { id: '1', title: 'React Performance Tips' },
        { id: '2', title: 'Next.js 14 App Router' },
    ]);
    const [activeChatId, setActiveChatId] = useState<string | null>('1');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);

    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Connect to actual backend when ready, or fallback to mock
        // const newSocket = io('http://localhost:5000');
        // setSocket(newSocket);
        // return () => { newSocket.close(); };
    }, []);

    const handleSendMessage = (content: string) => {
        // Add user message immediately
        const userMsg: Message = { role: 'user', content };
        setMessages(prev => [...prev, userMsg]);
        setIsStreaming(true);

        // If socket is connected, emit to server. Otherwise use mock for demo
        if (socket) {
            socket.emit('sendMessage', { chatId: activeChatId, message: content, userId: 'demo' });
        } else {
            // Mock streaming effect for UI demonstration
            setTimeout(() => {
                let streamString = "This is a streaming response from NeuroChat AI evaluating the context of your message: " + content;
                let index = 0;
                let tempContent = "";

                // Add empty assistant message
                setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

                const interval = setInterval(() => {
                    tempContent += streamString.charAt(index);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].content = tempContent;
                        return newMessages;
                    });
                    index++;
                    if (index >= streamString.length) {
                        clearInterval(interval);
                        setIsStreaming(false);
                    }
                }, 50);
            }, 500);
        }
    };

    const handleNewChat = () => {
        const newId = Date.now().toString();
        setChats([{ id: newId, title: 'New Chat' }, ...chats]);
        setActiveChatId(newId);
        setMessages([]);
    };

    if (loading || !user) {
        return (
            <div className="flex h-screen w-full bg-[#09090b] text-white items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-[#09090b] text-white overflow-hidden selection:bg-neon-purple/30">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                chats={chats}
                onNewChat={handleNewChat}
                activeChatId={activeChatId}
                onSelectChat={(id) => {
                    setActiveChatId(id);
                    // In a real app, fetch message history based on chat ID here
                    setMessages([
                        { role: 'user', content: `Loading history for chat ${id}...` },
                        { role: 'assistant', content: `Here is the history for chat ${id}.` }
                    ]);
                }}
            />
            <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
        </div>
    );
}
