const mongoose = require('mongoose')
const Schema = mongoose.Schema

const foundItemSchema = new Schema({
    name: {
        type: String,
        required: true  
    },
    description: {
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
})

module.exports = mongoose.model('FoundItem', foundItemSchema)
