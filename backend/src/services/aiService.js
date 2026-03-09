const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = 'You are NeuroChat, a futuristic, highly intelligent AI assistant. Be concise, helpful, and use a modern, engaging tone.';

// Try OpenAI first, fall back to Gemini
async function getAIStream(contextMessages, socket, chatId) {
    const hasValidOpenAI = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('dummy') && !process.env.OPENAI_API_KEY.includes('your_');
    const hasValidGemini = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_');

    // Try OpenAI first if key is available
    if (hasValidOpenAI) {
        try {
            const stream = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...contextMessages
                ],
                stream: true,
            });

            let fullResponse = '';
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullResponse += content;
                    socket.emit('messageChunk', { chatId, content });
                }
            }
            return fullResponse;
        } catch (err) {
            console.warn('OpenAI failed, falling back to Gemini:', err.message);
        }
    }

    // Fall back to Gemini
    if (hasValidGemini) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build Gemini message history format
        const geminiHistory = contextMessages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const lastMessage = contextMessages[contextMessages.length - 1].content;

        const chat = model.startChat({
            history: geminiHistory,
            systemInstruction: SYSTEM_PROMPT,
        });

        const result = await chat.sendMessageStream(lastMessage);

        let fullResponse = '';
        for await (const chunk of result.stream) {
            const content = chunk.text();
            if (content) {
                fullResponse += content;
                socket.emit('messageChunk', { chatId, content });
            }
        }
        return fullResponse;
    }

    throw new Error('No valid AI API key configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in backend/.env');
}

exports.setupSocketIO = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected for AI chat:', socket.id);

        socket.on('sendMessage', async (data) => {
            const { chatId, message, userId } = data;

            try {
                let chatDoc;

                // Find or create chat session
                if (chatId) {
                    chatDoc = await Chat.findById(chatId).catch(() => null);
                }

                if (!chatDoc) {
                    chatDoc = new Chat({
                        userId: userId || 'guest',
                        title: message.substring(0, 40) + (message.length > 40 ? '...' : ''),
                        messages: []
                    });
                }

                // Add user message to DB
                chatDoc.messages.push({ role: 'user', content: message });
                await chatDoc.save();

                // Last 10 messages for context
                const contextMessages = chatDoc.messages
                    .slice(-10)
                    .map(msg => ({ role: msg.role, content: msg.content }));

                // Stream AI response
                const fullResponse = await getAIStream(contextMessages, socket, chatDoc._id);

                // Save AI response to DB
                chatDoc.messages.push({ role: 'assistant', content: fullResponse });
                await chatDoc.save();

                socket.emit('messageComplete', { chatId: chatDoc._id, fullMessage: fullResponse });

            } catch (error) {
                console.error('Error in AI streaming:', error.message);
                socket.emit('error', { message: error.message || 'Failed to get AI response. Please check API Key.' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
