const mongus = require('mongoose')

const userSchema = new mongus.Schema({

    name: {type:String, required:true, min:2, max:20},
    friendCode: {type:String, required:false, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true, min:6, max:30},
    PFP: {type:String, required:false, default:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.UvobdGmUpxdAqYs_EcacWwHaEK%26pid%3DApi&f=1"},
    banner: {type:String, required:false, default:"https://i.ytimg.com/vi/tT7w2T6mFKc/maxresdefault.jpg"},
    bio: {type:String, required:false},
    followers:{type:Array, default:[]},
    followings:{type:Array, default:[]},
    isAdmin:{type:Boolean, default:false},
    interests: {type:Array, required:false, default:[]},
    friendCodeIsEmail: {type:Boolean, required:true},
    isBot: {type:Boolean, required:true},
    memberOf: {type:Array, required:false, default:[]}
}, {timestamps:true})

module.exports = mongus.model("User", userSchema)