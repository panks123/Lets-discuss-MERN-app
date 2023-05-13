const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const RefreshSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User' // using this we are creating the reference to the User collection (means userId will be from the User collection)
    }
    
}, {
    timestamps: true // for storing 'created at' and 'updated at' fields in the DB
})

// Creating model from schema
const Refresh = mongoose.model('Refresh', RefreshSchema, 'refreshtokens')

module.exports = Refresh;