const mongus = require('mongoose')

const communitySchema = new mongus.Schema({

    name: {type:String, required:true},
    owner: {type:String, required:true},
    members: {type:Array, required:true},
    chatChannels: {type:Array, required:false, default:[]},
    rules: {type:String, required:false, default:"1. no amongus\n2. no amongus"},
    settings: {type:Object, required:false, default:{futureMeProblem:true}},
    about: {type:String, required:false, default: "a community of everything and nothing",min:2, max:1000}
}, {timestamps:true})

module.exports = mongus.model('communities', communitySchema)