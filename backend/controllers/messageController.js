const Message = require("../models/Message");

// User sends message to Admin
exports.sendMessageToAdmin = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: "Content is required" });

        const message = await Message.create({
            sender: req.user.id,
            content,
        });

        res.status(201).json({ message: "Message sent to admin successfully", data: message });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Admin fetches all messages
exports.getAdminMessages = async (req, res) => {
    try {
        // Basic check for admin role (should be in middleware ideally)
        const messages = await Message.find().populate("sender", "name email").sort("-createdAt");
        res.json({ message: "Messages fetched", data: messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
// Admin replies to a user message
exports.replyToUser = async (req, res) => {
    try {
        const { messageId, reply } = req.body;
        if (!reply) return res.status(400).json({ message: "Reply is required" });

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { reply, repliedAt: new Date(), status: "read" },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json({ message: "Reply sent successfully", data: updatedMessage });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// User fetches their own messages and replies
exports.getUserMessages = async (req, res) => {
    try {
        const messages = await Message.find({ sender: req.user.id }).sort("-createdAt");
        res.json({ message: "User messages fetched", data: messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
