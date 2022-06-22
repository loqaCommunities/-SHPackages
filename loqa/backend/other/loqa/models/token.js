const mongus = require('mongoose')

const tokenSchema = new mongus.Schema({

    userID: {type:String, required:true, unique:true},
    token: {type:String, required:true, unique:true}
})

module.exports = mongus.model("Tokens", tokenSchema)