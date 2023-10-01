const mongoose = require('mongoose');

//To create a Model
// Step : 1  require('mongooes');
// Step : 2  create a mongooes schema (Structure of a user)
// Step : 3  create a model
const Song = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    thumbnail : {
        type : String,
        required : true
    },
    track : {
        type : String,
        required : true,
    },
    artist : {
        type : mongoose.Types.ObjectId,
        ref : 'user',
    },
    album: {
        type: mongoose.Types.ObjectId,
        ref: 'album',
        default: null,
    },
    duration : {
        type : Number,
        required : true,
    },
    timestamp : {
        type: Date, 
        default: Date.now,
    }
    
})


const SongModel = mongoose.model("Song", Song);

module.exports = SongModel;