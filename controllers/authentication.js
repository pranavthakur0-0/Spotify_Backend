const User = require('../models/User');
const bcrypt = require('bcrypt');
const {getToken} = require('../utils/helpers')

exports.authentication = async(req,res,next)=>{

    const {email, password, username , marketing, date, month, year, gender, data } = req.body;
     const user = await User.findOne({email});
         marketing, date, month, year, gender, data
    if(user){
        // if we don't write status code bydefault it will be set to 200
        // 400 401 402 403 are athuentication error notation.
        return res.status(403).json({error : "User with this email already exits."});
    }else{
        try {
            const dateOfBirth = `${date} + ${month} + ${year}`
            const hashPassword = await bcrypt.hash(password, 10); // Update this line
            const newUserData = { email, password: hashPassword, username, marketing, dateOfBirth, gender, data};
            const newUser = await User.create(newUserData);
            const token = getToken(email, newUser);
            const userToReturn = { ...newUser.toJSON(), token };
            req.userId = userToReturn._id;
            next();
            return res.status(200).json("Sucess");
       
          } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server Error' });
          }
    }

}




exports.login = async (req, res, next) => {
    const { email, password, rememberMe} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(403).json("Invalid Credentials");
    }
        // Since we don't store password as a plain text in register we have to compare the hash value 
        // we need to set parameters for hash value to always get the same hash value of the particular text
        // bcrypt compare the hash value 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(403).json("Invalid Credentials");
        }
        const token = await getToken(user.email, user);
        const userToReturn = { ...user.toJSON(), token };
        if (rememberMe) {
          const date = new Date();
          date.setDate(date.getDate() + 30);
          userToReturn.date = date;
        }
        delete userToReturn.password;
        return res.status(200).json(userToReturn);
  };
  

  exports.verifyUserById = async (req,res,next)=>{
    const user = req.user;
    if(user){
     return res.status(200).json({user : user._id});
    }
    return res.status(301).json({err : "Invalid"});
  }


 