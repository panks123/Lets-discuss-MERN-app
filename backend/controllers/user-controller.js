const userService = require("../services/user-service");
const UserDTO = require('../dtos/user-dto')

class UserController{
    async show(req, res){
        const { userId } = req.params
        const user = await userService.findUser({ _id: userId });

        const userRes = new UserDTO(user) 
        // console.log(userRes, "Sent!!")
        return res.json(userRes);
    }
}

module.exports = new UserController();