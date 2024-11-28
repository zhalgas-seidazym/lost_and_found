const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostItemSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [1, 'Name must not be empty'],
            trim: true,
            validate: {
                validator: function(value) {
                    return value.trim().length > 0
                },
                message: 'Name cannot be just whitespace'
            }
        },
        description: {
            type: String,
            required: false,
            trim: true
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
        timestamps: true
    }
)

module.exports = mongoose.model('LostItem', lostItemSchema)
