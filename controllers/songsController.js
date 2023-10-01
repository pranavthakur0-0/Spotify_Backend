const Song = require('../models/Songs');
const UserModel = require('../models/User');

function extractPathFromUrl(url) {
  const pattern = /\/v\d+\//;
  const withoutV1_1 = url.replace('/v1_1/', '/');
  const withoutVersion = withoutV1_1.replace(pattern, '/sizeAdjust/v1/');
  const withoutExtension = withoutVersion.replace(/\.[^.]+$/, '');
  return withoutExtension;
}

exports.createSong = async (req, res, next) => {
  try {
    const name = JSON.parse(req.body.text).songName;
    console.log(req.imageResult.secure_url);
    const path = extractPathFromUrl(req.imageResult.secure_url);
    const artist = req.user._id;
    const songDetails = {
      name,
      thumbnail: path,
      track: req.songResult.secure_url,
      artist,
      duration: req.songResult.duration
    };
    const createdSong = await Song.create(songDetails);
    console.log(createdSong);
    return res.status(200).json(createdSong);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: 'Internal Server error' });
  }
};


exports.getSong = async(req, res, next) =>{
    const currentUser = req.user;
    const songs = await Song.find({artist : currentUser._id});
    return res.status(200).json({data : songs})

}

exports.getArtistSong = async(req, res,next)=>{
    const {artistId} = req.params;
    const artist = await UserModel.findOne({_id : artistId});
    if(!artist){
        return res.status(302).json({err : 'Artist does not exist.'})
    }
    const songs = await Song.find({artist :  artistId});
    return res.status(200).json({data : songs});
}


exports.getNameSong = async (req, res, next) => {
    const { songName } = req.params;
    const regexPattern = new RegExp(songName, "i"); // "i" flag makes the pattern case-insensitive
  
    try {
      const songs = await Song.find({ name: regexPattern });
      return res.status(200).json({ data: songs });
    } catch (error) {
      // Handle any errors that occur during the search
      res.status(300).json({err : "Song not found"});
    }
  };
  