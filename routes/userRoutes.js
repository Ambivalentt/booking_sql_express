const {createUser, loginUser} = require('../services/userController.js');
const createReservation = require('../services/reservationController.js');
const express = require('express');
const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/reserve', createReservation)
module.exports = router;