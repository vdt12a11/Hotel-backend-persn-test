const User = require('../model/User');

const getProfile = async (req, res) => {
    try{
        const userID = req.params.userID;
        const profile = await User.find({userID});
        if (!profile) return res.status(204).json({ 'message': 'No profile found.' });
        res.json(profile);
    } catch (err) {
        console.log("Không lay duoc profile:", err.message);
        res.status(500).json({ message: err.message });
    }
}
module.exports = {
    getProfile
}
