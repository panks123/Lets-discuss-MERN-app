const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User' // using this we are creating the reference to the User collection (means userId will be from the User collection)
    },
    speakers: { // speakers will be array of User's Id type
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        required: false,
    }
}, {
    timestamps: true // for storing 'created at' and 'updated at' fields in the DB
})

// Creating model from schema
const RoomModel = mongoose.model('Room', RoomSchema, 'rooms')

module.exports = RoomModel;