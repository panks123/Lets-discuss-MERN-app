
const mongoose = require('mongoose')

const connectToMongo = ()=>{
    // MongoDB URI 
    const mongoURI = process.env.DB_CONNECTION_URI
    // Connect
    mongoose.connect(mongoURI, {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    })

    const db = mongoose.connection
    db.on('error', console.error.bind(console, "DB Connection Error!"))
    db.once('open', ()=>{
        console.log("Successfully connected to MongoDB")
    })   
}

module.exports = connectToMongo