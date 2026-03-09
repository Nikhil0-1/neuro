"use client";

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

type Message = { role: 'user' | 'assistant' | 'system'; content: string };
type Chat = { id: string; title: string };

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ChatPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Connect to backend WebSocket
    useEffect(() => {
        if (!user) return;

        const socket = io(BACKEND_URL, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Connected to NeuroChat backend');
        });

        // Receive streaming chunks
        socket.on('messageChunk', ({ content }: { chatId: string; content: string }) => {
            setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && lastMsg.role === 'assistant') {
                    lastMsg.content += content;
                    return [...updated];
                }
                return [...updated, { role: 'assistant', content }];
            });
        });

        // Stream complete
        socket.on('messageComplete', ({ chatId }: { chatId: string }) => {
            setIsStreaming(false);
            // Update active chat ID if this was a new chat
            if (!activeChatId) {
                setActiveChatId(chatId);
                setChats(prev => {
                    if (!prev.find(c => c.id === chatId)) {
                        return [{ id: chatId, title: 'New Chat' }, ...prev];
                    }
                    return prev;
                });
            }
        });

        // Handle errors
        socket.on('error', ({ message }: { message: string }) => {
            setIsStreaming(false);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ ${message}`
            }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const handleSendMessage = (content: string) => {
        if (!content.trim() || isStreaming) return;

        const userMsg: Message = { role: 'user', content };
        setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
        setIsStreaming(true);

        if (socketRef.current?.connected) {
            socketRef.current.emit('sendMessage', {
                chatId: activeChatId,
                message: content,
                userId: user?.uid || 'guest'
            });
        } else {
            // Fallback mock for offline mode
            setTimeout(() => {
                const response = "⚠️ Backend not connected. Please make sure the backend server is running on port 5000.";
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = response;
                    return updated;
                });
                setIsStreaming(false);
            }, 500);
        }
    };

    const handleNewChat = () => {
        setActiveChatId(null);
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
                    setMessages([]);
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
