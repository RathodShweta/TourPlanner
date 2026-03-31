const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
        }

        const feedback = await Feedback.create({
            user: req.user.id,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Public (or Private, depends on requirements. Let's make it public for the graph)
exports.getFeedbackStats = async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Format results to ensure all ratings 1-5 are present even if count is 0
        const formattedStats = [1, 2, 3, 4, 5].map(rating => {
            const found = stats.find(s => s._id === rating);
            return {
                rating: `${rating} Star`,
                count: found ? found.count : 0
            };
        });

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
