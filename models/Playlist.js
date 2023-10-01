const mongoose = require('mongoose');

const Playlist = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    type : {
        type : String,
        default : "Playlist"
    },
    thumbnail : {
        type : String,
    },
    description : {
        type : String,
    },
    owner : {
        type : mongoose.Types.ObjectId,
        ref : 'user',
    },
    songs: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'song',
            timestamps: true // This will add createdAt timestamp to each song
        },
    ],
    collaborators : [{
        type : mongoose.Types.ObjectId,
        ref: 'user'
    },]
})


const PlaylistModel = mongoose.model("Playlist", Playlist);

module.exports = PlaylistModel;