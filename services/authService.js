const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../constants');

exports.findByUsername = (username) => User.findOne({username});
exports.findByEmail = (email) => User.findOne({email});

exports.register = async  (email, username, password, repeatPassword) =>
{
    if (!password) {
        throw new Error('Password is required');
    }

     //Validate both passwords
     if (password !== repeatPassword){
        throw new Error('Password missmatch');
    }

    // Check if user exists
    const existingUser = await this.findByUsername(username);

    // const existingUser = await User.findOne({
    //     $or: [
    //         { email },
    //         { username },
    //     ]
    // });

    if (existingUser){
        throw new Error('User exists');
    }
    
    if (password.length < 4){
        throw new Error('Password too short');
    }

    //Add hash and salt
    const hashedPassword = await bcrypt.hash(password, 10);

   await  User.create ({ email, username, password: hashedPassword }); 

   return this.login(email, password); //login automatically after register
};

exports.login =  async (email, password) => 
{
    //User exists
    const user = await this.findByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    //Generate token
    const payload = {
        _id: user.id,
        email: user.email, 
        username: user.username,
    };

   const token = await jwt.sign(payload, SECRET, { expiresIn: '2h'});

   return token;
};
   