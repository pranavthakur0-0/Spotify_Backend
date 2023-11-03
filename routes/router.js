const express = require('express');
const router = express.Router();
const {authentication, login, verifyUserById} = require('../controllers/authentication');
const {createUserPref, userPref, currentSong, editcurrentSong, AllLikedSongInfo, EditLikedSong, AllLikedSong} = require('../controllers/userPrefController.js')
const {createSong, getSong, getArtistSong, getNameSong} = require('../controllers/songsController');
const {getArtistInfo} = require('../controllers/artistcontroller.js')
const {getUserProfile} = require('../controllers/userProfile.js')
const { createPlaylist, editPlaylist, userPlaylist, getPlaylistById, deleteUserPlaylist, createSimilarPlaylist, removeImageThumbnail ,removeSongFromSpecificPlaylist, getArtistPlaylist, addSongToPlaylist, getDefaultPlaylist} = require('../controllers/playlistController');
const passport = require('passport');
const {cdnImageUpload, cdnSongUpload} = require('../controllers/cdnUpload.js')
const { upload} = require('../controllers/fileupload.js');
const {searchSong} = require("../controllers/SearchController.js")
const cloudinary = require('cloudinary').v2;
// User Auth
router.route('/v1/auth/register').post(authentication, createUserPref);
router.route('/v1/auth/login').post(login);

router.route('/v1/auth/verifyUser').all(passport.authenticate('jwt', { session: false })).get(verifyUserById);



// User Profile
router.route('/v1/profile/:id').all(passport.authenticate('jwt', { session: false })).get(getUserProfile);

// Search
router.route('/v1/search/:query').all(passport.authenticate('jwt', {session : false}))
            .get(searchSong);


//User Preference 
router.route('/v1/currentSong').all(passport.authenticate('jwt', {session : false}))
            .get(currentSong).post(editcurrentSong);

            
router.route('/v1/userPref').all(passport.authenticate('jwt', {session : false}))
      .get(userPref);
router.route('/v1/likedSong').all(passport.authenticate('jwt', {session : false}))
           .get(AllLikedSongInfo).post(EditLikedSong);

router.route('/v1/likedSong').all(passport.authenticate('jwt', {session : false}))
           .get(AllLikedSong);


// Songs 
//get my songs
router.route('/v1/songs').all(passport.authenticate('jwt', { session: false }))
        .get(getSong)
        .post(upload, cdnImageUpload, cdnSongUpload, createSong);
        

// To get all songs of particular singer
router.route('/v1/artist/:artistId').all(passport.authenticate('jwt', { session: false }))
      .get(getArtistSong)


// To get specific song by search
router.route('/v1/song_name/:songName').all(passport.authenticate('jwt', { session: false }))
      .get(getNameSong);




//Playlist
router.route('/v1/playlist').all(passport.authenticate('jwt', {session : false} ))
      .get(createPlaylist, userPlaylist).post(upload, cdnImageUpload, editPlaylist);

   

router.route('/v1/getUserplaylist').all(passport.authenticate('jwt', {session : false} ))
      .get(userPlaylist);



      // below two same work different action
router.route('/v1/addSongPlaylist').all(passport.authenticate('jwt', {session : false}))
      .post(addSongToPlaylist);

router.route('/v1/playlist/:playlistId/:songId').all(passport.authenticate('jwt', {session : false} ))
      .patch(removeSongFromSpecificPlaylist);


 router.route('/v1/playlist/:playlistId').all(passport.authenticate('jwt', {session : false} ))
       .get(getPlaylistById).patch(removeImageThumbnail).delete(deleteUserPlaylist).post(createSimilarPlaylist);




router.route('/v1/artist_playlist/:artistId').all(passport.authenticate('jwt', {session : false} ))
      .get(getArtistPlaylist);

router.route('/v1/defaultplaylist').get(getDefaultPlaylist);


router.route('/v1/artistInfo/:id').all(passport.authenticate('jwt', {session : false} ))
      .get(getArtistInfo);



module.exports = router;





// router.route('/v1/cloud').get(async (req, res) => {
//       try {
//         // Replace 'public_id_here' with the actual public ID of the resource you want to fetch
//         const publicId = 'images/1695196374196';
    
//         // Get the Cloudinary optimized image URL
//         const optimizedUrl = cloudinary.url(publicId, {
//           transformations: [
//             {
//               quality: 'auto',
//             },
//             {
//               format: 'auto',
//             },
//           ],
//         });
    
//         // Return the optimized image URL in the response
//         return res.status(200).json({ optimizedUrl });
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }
//     });