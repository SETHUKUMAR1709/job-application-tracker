const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET user profile
router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Unauthorized access to profile' });
        }

        const user = await User.findById(req.params.userId).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
});

// UPDATE user profile
router.put('/:userId', authenticateToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this profile' });
        }

        const { bio, skills, experience, education, birthday, hometown, socialMedia } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                bio,
                skills,
                experience,
                education,
                birthday: birthday ? new Date(birthday) : null,
                hometown,
                socialMedia,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true } 
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
});

module.exports = router;
