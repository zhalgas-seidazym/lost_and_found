const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema(
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
        type: {
            type: String,
            required: true,
            enum: ['lost', 'found']
        },
        images: [{
            type: String,
            required: false
        }],
        date: {
            type: Schema.Types.Date,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        applied: {
            type: Schema.Types.Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Item', itemSchema)
