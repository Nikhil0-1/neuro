const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Define REST endpoints
// Note: Streaming responses will go through WebSockets or server-sent events. We will use SSE or WebSockets in the controller.
router.get('/', chatController.getAllChats);
router.post('/', chatController.createChat);
router.get('/:id', chatController.getChatHistory);

module.exports = router;
