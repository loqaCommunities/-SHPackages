const mongus = require('mongoose')

const defaultSettings = require('../../../configs/loqa/defaultCommunitySettings.json')

const communitySchema = new mongus.Schema({

    name: {type:String, required:true, minlength: 5, maxlength: 200},
    banner: {type:String, required:false, default:defaultSettings.banner},
    icon: {type:String, required:false, default:defaultSettings.icon},
    owner: {type:String, required:true},
    coOwners: {type:Array, required:false, default:[]},
    members: {type:Array, required:false, default:[]},
    rules: {type:String, required:false, default:defaultSettings.nonSettings.rules, minlength:2, maxlength:100},
    settings: {type:Object, required:false, default:defaultSettings.settings},
    about: {type:String, required:false, default: defaultSettings.nonSettings.about,minlength:2, maxlength:1000},
    bans: {type:Array, required:false, default:[]}
}, {timestamps:true})

module.exports = mongus.model('communities', communitySchema)