const mongus = require('mongoose')

const memberSchema = new mongus.Schema({

    userID: {type:String, required:true, unique:true},
    roles: {type:Array, required:false, default:[]},
    nick: {type:String, required:false},
    serverBio: {type:String, required:false},
    permissions: {type:Object, required:false, default:{

        owner:false,
        chat:{},
        forums:{},
        watch:{},
        home:{}
    }}
})

module.exports = mongus.model("Members", memberSchema)