// here we will keep the server requests that we'll make in the application

import axios from "axios";

// create an instance of axios
const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, /*'http://localhost:5500'*/
    withCredentials: true, // this will allow any server requests to set cookie
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
})

// endpoints available
export const sendOTP = (data)=>{
    // console.log(process.env.REACT_APP_BASE_URL)
    return api.post('/api/send-otp', data)
}

export const verifyOTP = (data)=>{
    return api.post('/api/verify-otp', data)
}

export const activate = (data)=> {
    return api.post('/api/activate', data)
}

export const logout = ()=>{
    return api.post('/api/logout')
}

export const createRoom = (data)=>{
    return api.post('/api/rooms', data)
}

export const getAllRooms = ()=> {
    return api.get('/api/rooms');
}

export const getRoom = (roomId)=>{
    return api.get(`/api/rooms/${roomId}`);
}

export const getUser = (userId)=>{
    return api.get(`/api/users/${userId}`);
}

// Interceptors - Axios interceptors are a powerful tool for making changes to requests and 
//                responses in a non-intrusive way where the code stays in a single place. 
//                They provide a way to modify and control the requests and responses that are sent and received by the application.
api.interceptors.response.use((config)=>{
    // config will have all the details abot response object and will have info about req as well
    return config;
}, 
async (error)=>{
    // store the original req for later use in a variable
    const originalReq = error.config; // It will store the original api req made
    if(error.response.status === 401 && originalReq && !originalReq._isRetry){
        originalReq._isRetry = true;
        try{
            // await axios.get('http://localhost:5500/api/refresh', { withCredentials: true })
            await axios.get(`${process.env.REACT_APP_BASE_URL}/api/refresh`, { withCredentials: true })
            // after this request cookies authToken and refreshToken will be set with refreshed values( see backend code)

            return api.request(originalReq) 
        }
        catch(err){
            console.log(err.message)
        }
    }
    
    throw error;
})

export default api;