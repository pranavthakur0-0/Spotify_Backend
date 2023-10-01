var jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path : './config/config.env'});

exports.getToken = (email, user)=>{
    const token = jwt.sign({identifier : user._id}, process.env.SECRET_KEY);
    return token;
};