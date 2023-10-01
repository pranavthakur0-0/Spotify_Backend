const mongoose = require('mongoose');

//To create a Model
// Step : 1  require('mongooes');
// Step : 2  create a mongooes schema (Structure of a user)
// Step : 3  create a model


const User = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        private: true
    },
    username : {
        type : String,
        required : true,
    },
    likedSongs : {
        type :  String,
        default : "",
    },
    dateOfBirth : {
        type  : String,
        required : true,
    },
    likedPlaylists : {
        type :  String,
        default : "",
    },
    subscribeArtist: {
        type :  String,
        default : "",
    },
    gender: {
        type :  String,
        default : "",
        required : true,
    },
    marketing : {
        type : Boolean,
        default  : false
    },
    data : {
        type : Boolean,
        default  : false
    }
})


const UserModel = mongoose.model("User", User);

module.exports = UserModel;