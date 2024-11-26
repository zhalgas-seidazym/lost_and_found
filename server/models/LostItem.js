const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostItemSchema = new Schema(
    {
        name: {
            type: String,
            required: true 
        },
        desctiption: {
            type: String,
            required: false
        },
        images: [{
            type: String,
            required: false 
        }],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('LostItem', lostItemSchema)
