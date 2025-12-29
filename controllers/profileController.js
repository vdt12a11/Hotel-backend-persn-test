const User = require('../model/user');

const getProfile = async (req, res) => {
    try{
        const userID = req.params.userID;
        const profile = await User.findById(userID).select({
            name: 1,
            email: 1,
            phone: 1,
            _id: 0   // nếu không muốn trả về _id
        });
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
