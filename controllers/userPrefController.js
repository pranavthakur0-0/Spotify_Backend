const SongModel = require("../models/Songs");
const UserModel = require("../models/User");
const UserPrefModel = require("../models/UserPreference")
const mongoose = require('mongoose');
const {setRedisValue, getRedisValue} = require('../redisConnect/redisFunction');


exports.createUserPref = async(req,res,next)=>{
    try{
        const id = req.userId;
        const response  = await UserPrefModel.create({userId : id});
        return;
    }catch(err){
        return res.status(500).json({ error: 'Server Error' });
    }
}



exports.userPref = async (req,res,next)=>{
    try{
        const id = req.user._id;
        const response = await UserPrefModel.findOne({userId : id});
        return res.status(200).json({data : response});
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Server Error' });
    }
}

exports.currentSong = async (req,res,next)=>{
      try {
        const id = req.user._id;
        const response = await UserPrefModel.findOne({userId : id}, {currentSong : 1});
        if(response.currentSong){
            const song = await SongModel.findById(response.currentSong);
            res.status(200).json({response :  song});
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({error : "Server Error"});
      }
}


exports.editcurrentSong = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentSongId = req.body._id;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(currentSongId)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }
      await UserPrefModel.findOneAndUpdate(
      { userId: userId },
      { currentSong: currentSongId },
    );
    res.status(200).json({ message: 'Current song updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.AllLikedSongInfo = async (req, res, next) => {
    try {
        const id = req.user._id;
        const response = await UserPrefModel.findOne({ userId: id }, { likedSong: 1 });
        if (response.likedSong.length > 0) {
          const likedSongs = response.likedSong; // Assuming response.likedSong is the array containing reference
          const songIds = likedSongs.map(songId => {
            // Check if songId is already an ObjectId instance, if not, convert it to ObjectId
            return songId instanceof mongoose.Types.ObjectId ? songId : mongoose.Types.ObjectId(songId);
          });
          const result = await SongModel.aggregate([
            {
              $match: {
                _id: { $in: songIds } // Filter to match only the documents with the given songIds
              }
            }
          ]);
       if(result.length > 0){
        const final = await Promise.all(result.map(async(item)=>{
          const fetch = await UserModel.findById(item.artist, {username : 1});
          const newItem = item;
          newItem.artistName = fetch.username;
           return newItem;
         }))
         return  res.status(200).json({result : final});

       }
      }

       return res.status(200).json({msg : "Songs you like will appear here"});
    } catch (error) {
       return res.status(500).json({error : "Server Error"});
    }
};



exports.AllLikedSong = async (req, res, next) => {
  try{
    const id = req.user._id;
    const response = await UserPrefModel.findOne({userId : id},{likedSong : 1});
    return res.status(200).json({data : response});
}catch(err){
    console.log(err);
    return res.status(500).json({ error: 'Server Error' });
}
}


exports.EditLikedSong = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const songId = req.body._id;
      const userPrefs = await UserPrefModel.findOne({ userId });
      const likedSongs = userPrefs.likedSong;
      const updateQuery = likedSongs.includes(songId)? { $pull: { likedSong: songId } } : { $addToSet: { likedSong: songId } };

    const response = await UserPrefModel.findOneAndUpdate(
      { userId },
      updateQuery,
      { new: true, upsert: true }
    );

    let msg = '';
    if (likedSongs.includes(songId)) {
      msg = 'Removed from your Liked Songs';
    } else {
      msg = 'Added to your Liked Songs';
    }
    
    res.status(200).json({ data: response.likedSong, success: true, msg });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};