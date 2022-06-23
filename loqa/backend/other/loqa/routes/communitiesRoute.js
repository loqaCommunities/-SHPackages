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
    const user = await User.findById(uToken.userID)
    nztk.log.normal(user, 2, '')
    return user
}

// create a community

router.post(`/create`, async (req, res) =>{

    const user = await getUserT(req.body.token)
    await !user && res.status(400).json("invalid token")

    try{

        const newCommunity = await new Community({

            members: [user._id],
            name: req.body.name,
            owner: user._id,
            about: req.body.about,
            rules: req.body.rules
        })

        await newCommunity.save()

        res.status(200).json(newCommunity)
    }catch(err){

        await nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})

// get a community

router.get(`/:id`, async (req, res) =>{

    try{
        
        var isLoggedIn = false
        user = await Token.findOne({token: req.body.token})
        if(user){
    
            isLoggedIn = true
        }
    
        if(isLoggedIn){
    
            const community = await Community.findById(req.params.id)
            await !community && res.status(400).json(`can't find a community with the id of ${req.params.id}`)
    
            return res.status(200).json(community)
        }else{
    
            const community = await Community.findById(req.params.id)
            await !community && res.status(400).json(`can't find a community with the id of ${req.params.id}`)
    
            return res.status(200).json({
    
                members: community.members.length,
                rules: community.rules,
                name: community.name,
                owner: community.owner,
                about: community.about,
                _id: community._id
            })
        }
    }catch(err){

        nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})