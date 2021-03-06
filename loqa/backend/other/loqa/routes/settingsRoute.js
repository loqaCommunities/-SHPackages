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
    if(!uToken) return null
    const user = await User.findById(uToken.userID)
    return user
}

// edit a community

// update a community
// TODO: let people other than owners use this w/ some perms system

router.put(`/communities/:id/:option`, async (req, res) =>{

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
    
        switch(req.params.option){

            // change the name of a community

            case "name":
                if(OID != UID) return res.status(400).json('invalid permissions')
                try{

                    if(!req.body.name || req.body.name.length < 5 || req.body.name.length > 199) return res.status(400).json(`invalid name`)
                    const oldName = community.name
                    community.name = await req.body.name || oldName
                    await community.save()
                    nztk.log.success(`changed ${oldName} to ${req.body.name}`, 1, 'edit')
                    res.status(200).json(community)
                }catch(err){

                    await nztk.log.error(err, 1, 'edit')
                    return res.status(500).json(err)
                }
            break
            
            // change it's owner

            case "owner":
                if(OID != UID) return res.status(400).json('invalid permissions')
                try{

                    const newOwner = await User.findById(req.body.newOwnerID)
                    !newOwner && res.status(400).json(`this person does not exist`)
                    if(!community.members.includes(newOwner._id)) return res.status(400).json(`this person isn't in this community`)

                    community.owner = await newOwner._id
                    await community.save()
                    res.status(200).json(community)
                }catch(err){

                    await nztk.log.error(err, 1, 'edit')
                    return res.status(500).json(err)
                }
            break

            // change it's description/about 

            case "about":
                if(OID != UID) return res.status(400).json('invalid permissions')
                try{

                    if(!req.body.about || req.body.about.length < 2 || req.body.about.length > 1000) return res.status(400).json(`invalid server description`)
                    community.about = await req.body.about
                    await community.save()
                    res.status(200).json(community)
                }catch(err){

                    await nztk.log.error(err, 1, 'edit')
                    return res.status(500).json(err)
                }
            break

            // change it's rules

            case "rules":
                if(OID != UID) return res.status(400).json(`invalid permissions`)
                try{

                    if(!req.body.rules || req.body.rules.length < 2 || req.body.rules.length > 1000) return res.status(400).json(`invalid server rules`)
                    community.rules = await req.body.rules
                    await community.save()
                    res.status(200).json(community)
                }catch(err){

                    await nztk.log.error(err, 1, 'edit')
                    return res.status(500).json(err)
                }
            break
    
            default:
                res.status(400).json(`invalid option`)
                break
        }
    }catch(err){

        await nztk.log.error(err, 1, 'edit')
        return res.status(500).json(err)
    }
})