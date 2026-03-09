const User = require('../models/User');

const syncUser = async (req, res) => {
    try {
        const { email, name, picture, uid } = req.user; // from decoded firebase token

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name: name || email.split('@')[0],
                googleId: uid,
                avatar: picture,
            });
            await user.save();
        } else {
            // Update fields in case they changed on Google's side
            user.name = name || user.name;
            user.avatar = picture || user.avatar;
            user.googleId = uid;
            await user.save();
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: 'Failed to sync user data' });
    }
}

module.exports = {
    syncUser
};
