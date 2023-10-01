const User = require('../models/User');
exports.getUserProfile = async (req, res, next)=>{
    try{
        const {id} = req.params;
        if(id){
            const user = await User.findById(id, {password : 0, marketing : 0, data: 0});
            return  res.status(200).json({user});
        }
    }catch(err){
        return  res.status(400).json({msg : "User Not Found"});
    }
  } 