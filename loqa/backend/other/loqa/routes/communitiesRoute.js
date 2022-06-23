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

// join a community

router.post(`/:id/join`, async (req, res) =>{

    try{

        const user = await getUserT(req.body.token)
        await !user && res.status(400).json(`couldn't validate the user`)

        const community = await Community.findById(req.params.id)
        await !community && res.status(400).json(`can't find a community with the id of ${req.params.id}`)

        if(community.members.includes(user._id)) return res.status(400).json(`you already are in this community`)
        if(community.bans.includes(user._id)) return res.status(400).json(`this user is banned from this community`)

        await community.members.push(user._id)
        await community.save()

        res.status(200).json(community)
    }catch(err){

        nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})

// delete a community

router.delete(`/:id/`, async (req, res) =>{

    try{

        const community = await Community.findById(req.params.id)
        nztk.log.normal(community.owner, 2)
        await !community && res.status(400).json(`can't find a community with an id of ${req.params.id}`)
        const OID = community.owner
    
        const user = await getUserT(req.body.token)
        nztk.log.normal(user._id, 2)
        await !user && res.status(400).json(`couldn't check user`)
        const UID = user._id

        nztk.log.warn(`${OID} = ${UID} (is the requester owner): ${OID == UID}`, 2)
        if(OID != UID) return res.status(400).json(`only this community's owner can destroy it`)

        await Community.deleteOne({_id: community._id})
        res.status(200).json(`community shattered`)
    }catch(err){

        nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})

// ban somebody

router.delete('/:id/ban', async (req, res) =>{

    try{

        const community = await Community.findById(req.params.id)
        nztk.log.normal(community.owner, 2)
        await !community && res.status(400).json(`can't find a community with an id of ${req.params.id}`)
        const OID = community.owner
    
        const user = await getUserT(req.body.token)
        nztk.log.normal(user._id, 2)
        await !user && res.status(400).json(`couldn't check user`)
        const UID = user._id

        nztk.log.warn(`${OID} = ${UID} (is the requester owner): ${OID == UID}`, 2)
        if(OID != UID) return res.status(400).json(`invalid permissions`)

        nztk.log.warn(`${community.members}, includes ${req.body.user}: ${community.members.includes(req.body.user)}`,  2,  "")
        if(!req.body.user || !community.members.includes(req.body.user)) return res.status(400).json(`invalid user`)

        if(community.bans.includes(req.body.user)) return res.status(400).json(`user is already banned`)

        const index = await community.members.indexOf(req.body.user)
        await community.members.splice(index, 1)
        await community.bans.push(req.body.user)
        await community.save()
        res.status(200).json(`user was banned`)
    }catch(err){

        nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})

// unban somebody

router.delete('/:id/unban', async (req, res) =>{

    try{

        const community = await Community.findById(req.params.id)
        nztk.log.normal(community.owner, 2)
        await !community && res.status(400).json(`can't find a community with an id of ${req.params.id}`)
        const OID = community.owner
    
        const user = await getUserT(req.body.token)
        nztk.log.normal(user._id, 2)
        await !user && res.status(400).json(`couldn't check user`)
        const UID = user._id

        nztk.log.warn(`${OID} = ${UID} (is the requester owner): ${OID == UID}`, 2)
        if(OID != UID) return res.status(400).json(`invalid permissions`)

        if(!req.body.user || !community.bans.includes(req.body.user)) return res.status(400).json(`invalid user`)

        if(!community.bans.includes(req.body.user)) return res.status(400).json(`user is not banned`)

        const index = await community.members.indexOf(req.body.user)
        await community.bans.splice(index, 1)
        await community.save()
        res.status(200).json(`user was unbanned`)
    }catch(err){

        nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})