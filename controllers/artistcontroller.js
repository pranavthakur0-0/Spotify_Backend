const UserModel = require("../models/User");

exports.getArtistInfo = async(req,res,next)=>{
   try {
   const {id} = req.params;
   const artist = await UserModel.findById(id, {username : 1});
   return res.status(200).json(artist);

    }  catch(Err){
        console.log(Err)
       return res.status(500).json({ error: 'Internal server error' });
    }
}