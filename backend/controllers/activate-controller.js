const Jimp = require('jimp') // We're using this package to compress the avatar image
const path = require('path');
const userService = require('../services/user-service');
const UserDTO = require('../dtos/user-dto');

class ActivateController {
    async activate(req, res) {
        // activation logic

        // get the username and avatar from req.body
        const { name, avatar } = req.body;
        if (!name || !avatar) {
            return res.status(400).json({ message: 'All fields are required!' })
        }

        // Image Base64 -> Buffer 
        const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64')

        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png` // creating a unique image path


        try {
            const jimpResponse = await Jimp.read(buffer); // It will read the buffer and convert to an object
            const resized = jimpResponse.resize(150, Jimp.AUTO) //  width: 15, height : AUTO(for preserving aspect ratio) - for the resized image

            // after compressing we'll be storing all the images in a folder
            resized.write(path.resolve(__dirname, `../storage/${imagePath}`))

        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Could not process the image" })
        }

        const userID = req.user._id

        try {
            const user = await userService.findUser({ _id: userID }) // user property we had attached to the req object in auth-middleware

            if (!user) {
                return res.status(404).json({ message: 'User not found!' })
            }
            // update user as activated
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`  // we'll store the path to the saved image into DB
            user.save();
            res.json({ user: new UserDTO(user), auth: true })
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Something went wrong!"})
        }

    }
}

module.exports = new ActivateController();