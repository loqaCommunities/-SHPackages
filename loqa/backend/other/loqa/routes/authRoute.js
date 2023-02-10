const router = require('express').Router()
const User = require('../models/user')
const Token = require('../models/token')
const NZTK = require('../../NZTK')
const nztk = new NZTK('loqa', {name: '', among: 'yes'})
const bcrypt = require('bcrypt')
const mongus = require('mongoose')

module.exports = router

const getUserT = async (token) =>{

    const uToken = await Token.findOne({token: token})
    if(!uToken) return null
    const user = await User.findById(uToken.userID)
    return user
}

// register 

router.post('/register', async (req, res) =>{

    if(mongus.connection.readyState < 1){

        nztk.log.warn(`mongoDB not connected, add your ip`, 1, 'mongo')
    }

    // save user

    try{

        // register a user
        
        const salt = await bcrypt.genSalt(10)
        const hashedPswd = await bcrypt.hash(req.body.password, salt)
        const user = await new User({

            name: req.body.username,
            email: req.body.email,
            password: hashedPswd,
            PFP: req.body.PFP,
            banner: req.body.banner,
            bio: req.body.bio,
            friendCode: req.body.email,
            friendCodeIsEmail: true,
            isBot: req.body.isBot || false
        })
        await user.save()
        const userTokenNonEnc = await `${req.body.username}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}${req.body.email}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}${req.body.password}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}`
        const userToken = await bcrypt.hash(userTokenNonEnc, salt)
        const token = await new Token({

            token: userToken,
            userID: user._id
        })
        await token.save()
        res.status(200).json(token)
    }catch(err){

        res.status(500).json(err)
        nztk.log.error(err, 1, "auth")
    }
})

// login

router.post('/login', async (req, res) =>{

    if(mongus.connection.readyState < 1){

        nztk.log.warn(`mongoDB not connected, add your ip`, 1, 'mongo')
    }

    try{

        const user = await User.findOne({email: req.body.email})
        !user && res.status(400).json('user not found')

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json('invalid password')

        const token = await Token.findOne({userID: user._id})
        !token && res.status(400).json(`can't find token`)

        res.status(200).json({

            ID: user._id,
            token: token.token
        })
    }catch(err){

        res.status(500).json(err)
        nztk.log.error(err, 1, "auth")
    }
})