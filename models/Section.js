const mongoose = require('mongoose');

//To create a Model
// Step : 1  require('mongooes');
// Step : 2  create a mongooes schema (Structure of a user)
// Step : 3  create a model

const Section = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    playlistId : {
        type : mongoose.Types.ObjectId,
        ref : 'playlist',
    }
})


const SectionModel = mongoose.model("Section", Section);

module.exports = SectionModel;