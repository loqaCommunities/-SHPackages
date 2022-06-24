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
    const user = await User.findById(uToken.userID)
    return user
}

// create a community

router.post(`/create`, async (req, res) =>{

    const user = await getUserT(req.body.token)
    await !user && res.status(400).json("invalid token")

    if(!req.body.name || req.body.name.length < 5 || req.body.name.length > 200) return res.status(400).json(`invalid name`)

    try{

        const newCommunity = await new Community({

            name: req.body.name,
            owner: user._id,
            about: req.body.about,
            rules: req.body.rules
        })
        
        await newCommunity.save()

        const defaultRole = await new Role({

            name: "people",
            communityID: newCommunity._id
        })

        await defaultRole.save()

        const ownerMember = await new Member({

            isOwner: true,
            userID: user._id,
            communityID: newCommunity._id
        })

        await ownerMember.save()

        await newCommunity.members.push(ownerMember._id)

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

        member = await Member.findOne({userID: user._id, communityID: community._id})
        if(!member){

            const newMember = await new Member({

                userID: user._id,
                communityID: community._id
            })
    
            await newMember.save()

            await community.members.push(newMember._id)
            await community.save()

            return res.status(200).json(community)
        }else{

            if(community.members.includes(member._id)) return res.status(400).json(`you already are in this community`)
            if(community.bans.includes(member._id)) return res.status(400).json(`this user is banned from this community`)

            await community.members.push(member._id)
            await community.save()

            return res.status(200).json(community)
        }
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

        const userMember = await Member.findOne({userID: req.body.user, communityID: community._id})
        if(!userMember) return res.status(400).json(`couldn't get user member card`)

        const curUserMember = await Member.findOne({userID: user._id, communityID: community._id})
        if(!curUserMember) return res.status(400).json(`couldn't get your member card`)

        if(!curUserMember.isOwner) return res.status(400).json(`invalid permissions`)

        if(community.bans.includes(userMember._id)) return res.status(400).json(`member is already banned`)
        if(!community.members.includes(userMember._id)) return res.status(400).json(`member isn't in this community`)

        const index = await community.members.indexOf(req.body.user)
        await community.members.splice(index, 1)
        await community.bans.push(userMember._id)
        await community.save()
        res.status(200).json(`member was banned`)
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

        const userMember = await Member.findOne({userID: req.body.user, communityID: community._id})
        if(!userMember) return res.status(400).json(`couldn't get user member card`)

        const curUserMember = await Member.findOne({userID: user._id, communityID: community._id})
        if(!curUserMember) return res.status(400).json(`couldn't get your member card`)

        if(!curUserMember.isOwner) return res.status(400).json(`invalid permissions`)

        if(!community.bans.includes(userMember._id)) return res.status(400).json(`member is not banned`)

        const index = await community.bans.indexOf(req.body.user)
        await community.bans.splice(index, 1)
        await community.save()
        res.status(200).json(`member was unbanned`)
    }catch(err){

        nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})

// kick somebody

router.delete('/:id/kick', async (req, res) =>{

    try{

        const community = await Community.findById(req.params.id)
        nztk.log.normal(community.owner, 2)
        await !community && res.status(400).json(`can't find a community with an id of ${req.params.id}`)
        const OID = community.owner
    
        const user = await getUserT(req.body.token)
        nztk.log.normal(user._id, 2)
        await !user && res.status(400).json(`couldn't check user`)
        const UID = user._id

        const userMember = await Member.findOne({userID: req.body.user, communityID: community._id})
        if(!userMember) return res.status(400).json(`couldn't get user member card`)

        const curUserMember = await Member.findOne({userID: user._id, communityID: community._id})
        if(!curUserMember) return res.status(400).json(`couldn't get your member card`)

        if(!curUserMember.isOwner) return res.status(400).json(`invalid permissions`)
        if(!community.members.includes(userMember._id)) return res.status(400).json(`member isn't in this community`)

        const index = await community.members.indexOf(req.body.user)
        await community.members.splice(index, 1)
        await community.save()
        res.status(200).json(`member was kicked`)
    }catch(err){

        nztk.log.error(err, 1, 'communities')
        return res.status(500).json(err)
    }
})