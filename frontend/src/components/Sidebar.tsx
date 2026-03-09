"use client";

import { motion } from "framer-motion";
import { Plus, MessageSquare, Settings, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    chats: any[];
    onNewChat: () => void;
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
}

export default function Sidebar({ isOpen, setIsOpen, chats, onNewChat, activeChatId, onSelectChat }: SidebarProps) {
    return (
        <>
            <motion.div
                initial={{ width: 280 }}
                animate={{ width: isOpen ? 280 : 0 }}
                className="h-full bg-[#18181b] border-r border-white/5 flex flex-col overflow-hidden hidden md:flex"
            >
                <div className="p-4 flex-shrink-0">
                    <button
                        onClick={onNewChat}
                        className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-lg p-3 transition-colors text-sm font-medium border border-white/5"
                    >
                        <Plus size={16} /> New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                    <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">Recent</h3>
                    <div className="flex flex-col gap-1">
                        {chats.length === 0 ? (
                            <p className="text-xs text-gray-500 px-2">No active chats</p>
                        ) : (
                            chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => onSelectChat(chat.id)}
                                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm text-left transition-colors truncate ${activeChatId === chat.id
                                            ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30'
                                            : 'text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    <MessageSquare size={16} className={activeChatId === chat.id ? 'text-[#8b5cf6]' : 'text-gray-400'} />
                                    <span className="truncate flex-1">{chat.title}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 flex flex-col gap-2">
                    <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <Settings size={18} /> Settings
                    </button>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-xs font-bold shadow-lg shadow-[#8b5cf6]/30">
                                U
                            </div>
                            <span className="text-sm font-medium">User</span>
                        </div>
                        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Toggle & Sidebar logic would go here, simplified for scope */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 md:hidden p-2 bg-[#18181b] rounded-lg border border-white/10"
            >
                {isOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
        </>
    );
}
