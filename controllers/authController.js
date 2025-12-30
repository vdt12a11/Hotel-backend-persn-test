const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ email: email }).exec();
    console.log(foundUser);
    if (!foundUser) 
    {
        return res.status(401).json({ 'message': 'Sai email va mat khau1' }); //Unauthorized 
        
    }
    // evaluate password 
    
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        
        res.status(201).json({ 'userID': foundUser._id,
                                'name':foundUser.name,
                            'email':foundUser.email});
        
    } else {
        res.status(401).json({ 'messagee': 'Sai emai va mat khau2' });;
    }
}

module.exports = { handleLogin };