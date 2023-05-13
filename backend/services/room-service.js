const RoomModel = require('../models/room-model')

class RoomService{
    async create(payload){
        const { topic, roomType, ownerId } = payload;

        // insert into DB (create the room in the rooms collection in DB)
        const room =await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        });

        return room;
    }

    async getAllRooms(types){
        const rooms = await RoomModel.find({ roomType: { $in: types } })
        .populate('speakers') // this will populate the whole object of speakers(not just the speaker ids)
        .populate('ownerId') //  this will populate the whole object of ownerId(not just the ownerId)
        .exec();
        return rooms;
    }

    async getRoom(roomId){
        const room = await RoomModel.findOne({_id: roomId})
        return room
    }
}

module.exports = new RoomService()