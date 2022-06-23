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

// check for a user

const getUserT = async (token) =>{

    const uToken = await Token.findOne({token: token})
    const user = await User.findById(uToken.userID)
    return user
}

// problem for later
