const mongus = require('mongoose')

const commentSchema = new mongus.Schema({

    parentID: {type:String, required:true},
    reactions: {type:Array, required:false, default:[]},
    posterID: {type:String, required:true},
    content: {type:String, required:true}
}, {timestamps:true})

module.exports = mongus.model("Comments", commentSchema)