// dto (data transfer object) - we use dto to transform the data(e.g. data from db) before sending response

class UserDTO{
    id;
    phone;
    name;
    avatar;
    createdAt;
    activated;

    constructor(user){
        this.id = user ? user._id : null;
        this.activated = user ? user.activated : false;
        this.createdAt = user ? user.createdAt : false;
        this.phone = user ? user.phone : null;
        this.name = user ? user.name : null;
        this.avatar = user ? user.avatar : null;
    }
}

module.exports =  UserDTO;