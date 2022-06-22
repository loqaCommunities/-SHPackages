const mongus = require('mongoose')

const msgSchema = new mongus.Schema({

    posterID: {type:String, required:true},
    content: {type:String, required:true, minlength:2, maxlength:2000},
    channelID: {type:String, required:true},
    reactions: {type:Array, required:false, default:[]},
    mentions: {type:Array, required:false, default:[]},
    replyID: {type:String, required:false}
}, {timestamps:true})

module.exports = mongus.model("MSG", msgSchema)