const router = require('express').Router()
const NZTK = require('../../NZTK')
const nztk = new NZTK('loqa', {name: '', among: 'yes'})
const bcrypt = require('bcrypt')
const mongus = require('mongoose')

// models

const Community = require('../models/community')
const User = require('../models/user')
const Token = require('../models/token')

module.exports = router

const getUserT = async (token) =>{

    const uToken = await Token.findOne({token: token})
    if(!uToken) return null
    const user = await User.findById(uToken.userID)
    return user
}

// post a *ehm* post

router.post(`/:parentType/:section`, (req, res) =>{

    res.status(418).json(`i'm a teapot not a fancy ahh server`)
})