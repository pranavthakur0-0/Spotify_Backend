const mongoose = require('mongoose');
//To create a Model
// Step : 1  require('mongooes');
// Step : 2  create a mongooes schema (Structure of a user)
// Step : 3  create a model
const UserPreference = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref: 'user',
        required : true
    },
    currentSong : {
        type : mongoose.Types.ObjectId,
        ref: 'song'
    },
    queue :  [{
        type : mongoose.Types.ObjectId,
        ref: 'song'
    },],
    shuffle :  [{
        type : mongoose.Types.ObjectId,
        ref: 'song'
    },],
    likedSong : [{
        type : mongoose.Types.ObjectId,
        ref: 'song'
    },]
})


const UserPrefModel = mongoose.model("UserPreference", UserPreference);

module.exports = UserPrefModel;