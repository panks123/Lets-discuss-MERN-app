const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    phone: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
        // a getter function
        get: (avatar)=> {
            if(avatar)
                return `${process.env.BASE_URL}${avatar}`
            
            return avatar
        }
    },
    activated: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true, // for storing 'created at' and 'updated at' fields in the DB,
    toJSON: { getters: true }, // this will apply the getters
})

// Creating model from schema
const User = mongoose.model('User', UserSchema, 'users') // first parameter 'user' is the model name and third parameter is the collection name that will be created in the DB

module.exports = User;