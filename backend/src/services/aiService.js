const OpenAI = require('openai');
const Chat = require('../models/Chat');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key', // Ensure this is set in .env
});

exports.setupSocketIO = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected for AI chat:', socket.id);

        socket.on('sendMessage', async (data) => {
            const { chatId, message, userId } = data;

            try {
                let chat;
                // Find or create chat session
                if (chatId) {
                    chat = await Chat.findById(chatId);
                }

                if (!chat) {
                    chat = new Chat({
                        userId: userId || "65c3b1a201b23f001abc1234",
                        title: message.substring(0, 30) + '...',
                        messages: []
                    });
                }

                // Add user message
                chat.messages.push({ role: 'user', content: message });
                await chat.save();

                // Get last 10 messages for context window
                const contextMessages = chat.messages
                    .slice(-10)
                    .map(msg => ({ role: msg.role, content: msg.content }));

                // Send to OpenAI
                const stream = await openai.chat.completions.create({
                    model: 'gpt-4o-mini', // or another available model
                    messages: [
                        { role: 'system', content: 'You are NeuroChat, a futuristic, highly intelligent AI assistant.' },
                        ...contextMessages
                    ],
                    stream: true,
                });

                let fullResponse = '';

                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        fullResponse += content;
                        socket.emit('messageChunk', { chatId: chat._id, content });
                    }
                }

                // Save AI response
                chat.messages.push({ role: 'assistant', content: fullResponse });
                await chat.save();

                socket.emit('messageComplete', { chatId: chat._id, fullMessage: fullResponse });

            } catch (error) {
                console.error('Error in AI streaming:', error);
                socket.emit('error', { message: 'Failed to process AI response. Please check API Key or try again.' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
