const FAQ = require("../models/FAQ");

exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: 1 });
        res.status(200).json({ success: true, count: faqs.length, data: faqs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch FAQs" });
    }
};

exports.createFAQ = async (req, res) => {
    try {
        const faq = new FAQ(req.body);
        await faq.save();
        res.status(201).json({ success: true, data: faq });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
