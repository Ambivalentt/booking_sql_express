require('dotenv').config()
const ReservationRepository = require('./reservationRepository.js');
const jwt = require('jsonwebtoken')

const createReservation = async (req, res) => {
    
    try {
        const {details, data_reservation} = req.body
        const token = req.cookies.access_token
        if (!token) return res.status(401).json({ error: 'Unauthorized' })
        const data = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Decoded JWT:', data);
        if (!data) return res.status(401).json({ error: 'user not found' })
        req.user = data;
        const user_id = req.user.id
        const createReservation = await ReservationRepository.create({details, user_id, data_reservation})
        console.log('Reservation creation result:', createReservation);

        res.status(200).json({message:'Reservation created successfully', createReservation})
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = createReservation