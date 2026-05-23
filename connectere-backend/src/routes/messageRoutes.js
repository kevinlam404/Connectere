const express = require('express');
const Message = require('../models/Messages');
const router = express.Router();

//Get messages for a room
router.get('/:room', async (req, res) => {
    try {
        const messages = await Message.find({room: req.params.room}).sort({createdAt: 1});
        res.json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete messages from a room
router.delete("/:id", async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({success: true});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;