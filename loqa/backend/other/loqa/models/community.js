const mongus = require('mongoose')

const communitySchema = new mongus.Schema({

    name: {type:String, required:true, minlength: 5, maxlength: 200},
    owner: {type:String, required:true},
    members: {type:Array, required:true},
    chatChannels: {type:Array, required:false, default:[]},
    rules: {type:String, required:false, default:"1. no amongus\n2. no amongus", minlength:2, maxlength:100},
    settings: {type:Object, required:false, default:{futureMeProblem:true}},
    about: {type:String, required:false, default: "a community of everything and nothing",minlength:2, maxlength:1000},
    bans: {type:Array, required:false, default:[]}
}, {timestamps:true})

module.exports = mongus.model('communities', communitySchema)