const router = require('express').Router();
const authController = require('./controllers/auth-controller')
const activateController = require('./controllers/activate-controller');
const roomsController = require('./controllers/rooms-controller');
const userController = require('./controllers/user-controller')
const authMiddleware = require('./middlewares/auth-middleware');

router.post('/api/send-otp', authController.sendOTP) // http://localhost:5500/api/send-otp -> No accessToken required

router.post('/api/verify-otp', authController.verifyOTP) // http://localhost:5500/api/verify-otp -> No accessToken required

router.post('/api/activate', authMiddleware, activateController.activate) // http://localhost:5500/api/activate -> No accessToken required(will be recieved as cookie if exists)

router.get('/api/refresh', authController.refresh) // http://localhost:5500/api/refresh -> for refreshing token using refresh token

router.post('/api/logout', authMiddleware, authController.logout) // http://localhost:5500/api/logout -> for doing all the necessary operations for logaout

router.post('/api/rooms', authMiddleware, roomsController.create) // http://localhost:5500/api/rooms -> for creating a room

router.get('/api/rooms', authMiddleware, roomsController.index) // http://localhost:5500/api/rooms -> for fetching all available rooms from database

router.get('/api/rooms/:roomId', authMiddleware, roomsController.show) // http://localhost:5500/api/rooms/<roomId> -> for fetching a single room

router.get('/api/users/:userId', userController.show)

module.exports = router;