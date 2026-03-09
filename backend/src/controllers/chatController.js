const Chat = require('../models/Chat');

exports.getAllChats = async (req, res) => {
    try {
        // Hardcoded for now until Auth is fully integrated
        const userId = req.user ? req.user.id : "65c3b1a201b23f001abc1234";
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching chats' });
    }
};

exports.createChat = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : "65c3b1a201b23f001abc1234";
        const { title } = req.body;

        const newChat = new Chat({
            userId,
            title: title || 'New Chat',
            messages: []
        });

        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating chat' });
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching chat history' });
    }
};
