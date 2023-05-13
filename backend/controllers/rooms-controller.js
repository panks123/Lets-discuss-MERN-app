const RoomDTO = require("../dtos/room-dto");
const roomService = require("../services/room-service");

class RoomsController{
    async create(req, res){
        const {topic, roomType} = req.body;

        if(!topic || !roomType){
            return res.status(400).json({message: "All fields are required!"})
        }

        const room = await roomService.create({
            topic,
            roomType,
            ownerId: req.user._id, // since the authMiddleware will append the authenticated user in the req obj, so we'll get the access to the user's data
        })
        // console.log(room)

        return res.json(new RoomDTO(room))
    }

    async index(req, res){

        const rooms = await roomService.getAllRooms(['open']); // fetching rooms of type 'open' from DB
        const allRooms = rooms.map( room => new RoomDTO(room))
        return res.json(allRooms)

    }

    async show(req, res){
        const room = await roomService.getRoom(req.params.roomId);
        return res.json(room);
    }
}

module.exports = new RoomsController();