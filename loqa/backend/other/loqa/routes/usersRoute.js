const router = require('express').Router()
const NZTK = require('../../NZTK')
const nztk = new NZTK('loqa', {name: '', among: 'yes'})
const bcrypt = require('bcrypt')
const mongus = require('mongoose')

// models

const Community = require('../models/community')
const User = require('../models/user')
const Token = require('../models/token')
const Member = require('../models/member')
const Role = require('../models/role')

module.exports = router

const getUserT = async (token) =>{

    const uToken = await Token.findOne({token: token})
    if(!uToken) return null
    const user = await User.findById(uToken.userID)
    return user
}

router.get(`/:id`, async (req, res) =>{

    
    try{
        
        const user = await User.findById(req.params.id)
        if(!user) return res.status(400).json(`couldn't find user`)

        // not all info has to be public

        return res.status(200).json({

            name: user.name,
            _id: user._id,
            friendCode: user.friendCode,
            PFP: user.PFP,
            banner: user.banner,
            memberOf: user.memberOf,
            followers: user.followers,
            followings: user.followings,
            bio: user.bio,
            interests: user.interests,
            isAdmin: user.isAdmin,
            friendCodeIsEmail: user.friendCodeIsEmail,
            email: user.email,
            isBot: user.isBot
        })
    }catch(err){

        await nztk.log.error(err, 1, 'communities')
        res.status(500).json(err)
    }
})