const User = require('../model/user');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, password,email, phone } = req.body;
    if (!name || !password ||!email||!phone) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
            "name": name,
            "password": hashedPwd,
            "email": email,
            "phone": phone
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${email} created!` });
    } catch (err) {
        res.status(500).json({ 'messagee': err.message });
    }
}

module.exports = { handleNewUser };