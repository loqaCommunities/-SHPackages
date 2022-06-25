const mongus = require('mongoose')

const defaultSettings = require('../../../configs/loqa/defaultCommunitySettings.json')

const roleSchema = new mongus.Schema({

    name: {type:String, required:true, minlength:2, maxlength:100},
    communityID: {type:String, required:true},
    color: {type:String, required:false, default:"#000000"},
    icon: {type:String, required:false, default:"default'MEMBER'"},
    permOverwrites: {type:Array, required:false, default:[]},
    muted: {type:Boolean, required:false, default:false}
}, {timestamps:true})

module.exports = mongus.model('roles', roleSchema)