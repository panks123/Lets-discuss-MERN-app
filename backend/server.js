require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const connectToMongo = require('./db')
const router = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const ACTIONS = require('./socket-actions');



const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5500;

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser());

app.use('/storage', express.static('storage'))

// connect to DB
connectToMongo()

// Middlewares
app.use(express.json({ limit: '8mb' })); // limit option: Controls the maximum request body size. 
// If this is a number, then the value specifies the number of bytes; 
// if it is a string, the value is passed to the bytes library for parsing. 
// Defaults to '100kb'.

// This option we are setting because we'll be sending base64 string of image to the server inside request

// Router
app.use(router)

app.get('/', (req, res) => {
    res.send("Hello")
})


// Sockets logic

const socketUserMapping = {}; // to keep the mapping of ' whcich socket id belongs to which user'

io.on('connection', (socket) => {
    console.log("New connection", socket.id)

    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;
        // get all the connected clients connected in the room
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []) // io.sockets.adapter.get(roomId) will return a map(Map) object's value
        console.log("Clients", clients);

        // we'll emit an event to connect to all the clients in the room with id 'roomId' - for peer-to-peer connection
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false, // beacause current user will create the offer and request the other clients
                user
            })

            // Also join self to the room
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId]
            })
        })

        // 
        socket.join(roomId) // It will allow the current user to join with the given roomId (if no such room then it will first create a room with the given roomId)
    })

    // handle relay ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        // send the icecandidate to peerId(client)
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate
        })
    })

    // handle relay sdp (session description)
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription,
        })
    })

    // handle mute/ unmute

    socket.on(ACTIONS.MUTE, ({ roomId, userId })=>{

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        
        clients.forEach((clientId)=>{
            io.to(clientId).emit(ACTIONS.MUTE, { peerId : socket.id, userId })
        })
    })

    socket.on(ACTIONS.UNMUTE, ({ roomId, userId })=>{

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        
        clients.forEach((clientId)=>{
            io.to(clientId).emit(ACTIONS.UNMUTE, { peerId : socket.id, userId })
        })
    })

    // handle leaving the room

    const leaveRoom = ({ roomId }) => {
        const { rooms } = socket;

        Array.from(rooms).forEach(roomId => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

            clients.forEach(clientId => {
                // remove the current client from all the clients connected
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping[socket.id]?.id,
                })

                // remove all the clients connected from the current client
                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMapping[clientId]?.id
                })
            })

            socket.leave(roomId)
        })

        delete socketUserMapping[socket.id];
    }

    socket.on(ACTIONS.LEAVE, leaveRoom);

    socket.on('disconnecting', leaveRoom)
})

server.listen(PORT, () => {
    console.log("Server listening at ", PORT)
})