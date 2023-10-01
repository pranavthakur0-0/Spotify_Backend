const PlaylistModel = require("../models/Playlist");
const SongModel = require("../models/Songs");
const UserModel = require("../models/User");
const multer = require('multer');
const upload = multer().fields([]); // Accept all fields as text


exports.createPlaylist = async(req, res, next)=>{
     const currentUser = req.user;
    // const {name, thumbnail, songs} = req.body;
    const name  = "My Playlist #";
     if(!name){
         return res.status(400).json({err : "Insufficient Data"})
     }
     const playlistData = {name, owner : currentUser._id, owner : currentUser, collaborators : []};
     const playlist = await PlaylistModel.create(playlistData);
    if(playlist){
        next();
    }
}





// router.js
exports.editPlaylist = async (req, res, next) => {
  try {
    const { name, id, description } = JSON.parse(req.body.text);
    const playlistData = {};

    playlistData.name = name || undefined;
    playlistData.description = description || undefined;
    if (req.imageResult) {
      playlistData.thumbnail = req.imageResult.url;
    }
    const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(id, playlistData, { new: true });

    res.status(200).json({ message: 'Playlist Updated', playlist: updatedPlaylist});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


  
//--- Getting the playlist by using UserId it will get us all the playlist that user made
exports.userPlaylist = async (req, res, next) => {
    const currentUser = req.user;
    const playlist = await PlaylistModel.find({ owner: currentUser._id });

    if (playlist && playlist.length > 0) {
        const playlistWithUsername = [];
        for (let item of playlist) {
            const user = await UserModel.findById(item.owner);
            item = item.toObject(); // Convert the Mongoose document to a plain JavaScript object
            item.username = user.username;
            playlistWithUsername.push(item);
        }
       res.status(200).json({playlistWithUsername, msg : "Added to library"});
    }else{
        res.status(200).json([]);
    }
    // If no playlists were found, return an empty array

};


//----  Getting the playlist by using playlist id

exports.getPlaylistById = async(req,res,next)=>{
    const {playlistId} = req.params;
    console.log(playlistId);
    try{
        const playlistData = await PlaylistModel.findById(playlistId);
        if(!playlistData){
            return res.status(301).json({err : "Invalid"});
        }
        const username = await UserModel.findById(playlistData.owner, {username : 1});
        const playlist = playlistData.toJSON();
        playlist.username = username.username;
        const songIds = playlistData.songs;
        const songs = await SongModel.find({ _id: { $in: songIds } });
        playlist.songDetails = songs;
        return res.status(200).json(playlist);
    }catch(err){
        return res.status(301).json({err : "Invalid"});
    }
}

//--- Remove the thumbnail of the plaulist
exports.removeImageThumbnail = async(req,res,next)=>{
    const {playlistId} = req.params;
    try{
        const playlistData = await PlaylistModel.findByIdAndUpdate(playlistId, { thumbnail: null }, { new: true });
        return res.status(200).json(playlistData);
    }catch(err){
        return res.status(301).json({err : "Invalid"});
    }
}


exports.removeSongFromSpecificPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;

    // Use $pull to remove songId from the songs array
    const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: songId } },
      { new: true }
    );

    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    return res.status(200).json({ message: 'Song removed from playlist', playlist: updatedPlaylist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//----  Get all playlist made by the artist

exports.getArtistPlaylist = async (req,res,next)=>{
    const {artistId} = req.params;
    const artist = await UserModel.findOne({_id : artistId});
    if(!artist){
        return res.status(304).json({err : "Invalid Artist Id"});
    }

    const playlist = await PlaylistModel.find({owner : artistId});
    return res.status(200).json({data : playlist});
}


//---- Add song to Playlist
exports.addSongToPlaylist = async (req, res, next) => {
    console.log("helli");
    const currentUser = req.user;
    const { playlistId, songId } = req.body;
    console.log(playlistId, songId);
    const playlist = await PlaylistModel.findOne({ _id: playlistId });

    //playlist.owner.equals(currentUser._id)  
    // Point to rememeber playlist.owner is an object and currentUser._id is also object so we cannot compare them using ===
    // equals is a method in which it compares the value inside the object
     if (!playlist.owner.equals(currentUser._id) && !playlist.collaborators.includes(currentUser._id)) {
       return res.status(304).json({ err: "Not allowed." });
     }
             // Check if the song is valid or not
       const song = await SongModel.findOne({ _id: songId });
       if (!song) {
         return res.status(304).json({ err: "Song not found" });
       }
       if(playlist.songs.includes(songId)){
           return res.status(409).json({ err: "Song is already in the playlist" })
       }
       playlist.songs.push(songId);
       await playlist.save();
    
       return res.status(200).json({ data: playlist });

  };
  


  //getting default playlist when user is not logged in

  exports.getDefaultPlaylist = async(req,res,next)=>{
    try{
        const playlist = await PlaylistModel.findOne({});
        if(!playlist){
            return res.status(301).json({err : "Invalid"});
        }
        return res.status(200).json(playlist);
    }catch(err){
        return res.status(301).json({err : "Invalid"});
    }
  }