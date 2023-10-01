const cloudinary = require('cloudinary').v2;

exports.cdnImageUpload = async(req,res,next)=>{
    if(req.files.image){
        try {
            const imageResult = await cloudinary.uploader.upload(req.files.image[0].path, {
              public_id : `${Date.now()}`,
              resource_type : 'auto',
              folder : 'images'
             });
             req.imageResult = imageResult;
             next();
          } catch (error) {
            console.log(error);
          }
    }else{
        next();
    }
}


exports.cdnSongUpload = async(req,res,next)=>{
    if(req.files.song){
        try {
            const songResult = await cloudinary.uploader.upload(req.files.song[0].path, {
              public_id : `${Date.now()}`,
              resource_type : 'auto',
              folder : 'songs'
             });
             req.songResult = songResult;
             console.log("hrere");
             next();
          } catch (error) {
            console.log(error);
          }
    }else{
        next();
    }
}