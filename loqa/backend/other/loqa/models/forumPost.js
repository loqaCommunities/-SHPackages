const mongus = require('mongoose')

const postSchema = new mongus.Schema({

    posterID: {type:String, required:true},
    content: {type:String, required:true, minlength:2, maxlength:4000},
    channelID: {type:String, required:true},
    reactions: {type:Array, required:false, default:[]},
    mentions: {type:Array, required:false, default:[]}
}, {timestamps:true})

module.exports = mongus.model("Post", postSchema)