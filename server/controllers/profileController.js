const bcrypt = require('bcrypt')

const User = require("../models/User")
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')

const getUserInfo = async (req, res) => {
    try{
        const user = {
            id: req.user.id,
            email: req.user.email,
            telegram: req.user.telegram,
            phone: req.user.phone
        }
    
        let lostPosts = await LostItem.find({
            user: user.id
        })
        lostPosts = lostPosts.map(item => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                images: item.images,
                user: item.user,
                category: item.category
            }
        })
    
        let findPosts = await FoundItem.find({
            user: user.id
        })
        findPosts = findPosts.map(item => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                images: item.images,
                user: item.user,
                category: item.category
            }
        })
    
        user.lostItems = lostPosts
        user.findItems = findPosts
    
        res.status(200).json(user)
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

const changePassword = async (req, res) => {
    try{
        const {currentPassword, newPassword} = req.body
        const isMatch = await bcrypt.compare(currentPassword, req.user.password)
        if(isMatch){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            await User.findByIdAndUpdate(
                req.user.id,
                {
                    password: hashedPassword
                }
            )

            res.status(400).json({message: 'Passwords changed successfully.'})
        }
        else res.status(400).json({message: 'Unmatching passwords.'})
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

const changeTelegram = async (req, res) => {
    try{
        await User.findByIdAndUpdate(
            req.user.id,
            {
                telegram: req.body.telegram
            }
        )

        res.status(200).json({message: 'Telegram nickname changed successfully.'})
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

const changePhone = async (req, res) => {
    try{
        await User.findByIdAndUpdate(
            req.user.id,
            {
                phone: req.body.phone
            }
        )

        res.status(200).json({message: 'Phone number changed successfully.'})
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

module.exports = {
    getUserInfo,
    changePassword,
    changeTelegram,
    changePhone
}