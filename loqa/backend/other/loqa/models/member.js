const mongus = require('mongoose')

const memberSchema = new mongus.Schema({

    userID: {type:String, required:true, unique:false},
    communityID: {type:String, required:true},
    roles: {type:Array, required:false, default:[]},
    nick: {type:String, required:false},
    localBio: {type:String, required:false},
    isOwner: {type:Boolean, required:false, default:false}
})

module.exports = mongus.model("Members", memberSchema)