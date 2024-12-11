const bcrypt = require('bcrypt')

const User = require("../models/User")
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')

const getUserInfo = async (req, res) => {
    try{
        const user = {
            id: req.user.id,
            name: req.user.name,
            surname: req.user.surname,
            email: req.user.email,
            telegram: req.user.telegram,
            phone: req.user.phone
        }
    
        let lostPosts = await LostItem.find({
            userId: user.id
        }).populate('categoryId')
        lostPosts = lostPosts.map(item => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                images: item.images,
                userId: item.userId,
                category: {
                    id: item.categoryId._id,
                    name: item.categoryId.name
                },
                lostDate: item.lostDate,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }
        })
    
        let findPosts = await FoundItem.find({
            userId: user.id
        }).populate('categoryId')
        findPosts = findPosts.map(item => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                images: item.images,
                userId: item.userId,
                category: {
                    id: item.categoryId._id,
                    name: item.categoryId.name
                },
                foundDate: item.foundDate,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
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

            res.status(200).json({message: 'Passwords changed successfully.'})
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

const changeCredentials = async (req,  res) => {
    try{
        let {name, surname} = req.body

        const credentials = {}

        if(name && name.length != 0){
            credentials.name = name
        }
        if(surname && surname.length != 0){
            credentials.surname = surname
        }

        await User.findByIdAndUpdate(
            req.user.id,
            credentials
        )
        
        res.status(200).json({message: 'User credentials changed successfully.'})
    }
    catch(e){
        res.status(500).json({message: e.message || 'An unexpected error occurred.' })
    }
}

module.exports = {
    getUserInfo,
    changePassword,
    changeTelegram,
    changePhone,
    changeCredentials
}