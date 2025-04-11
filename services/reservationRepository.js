const reservation = require('../src/server.js')

class ReservationRepository {
    static async create({ details, user_id, data_reservation }) {
        Validation.details(details)
        const date = new Date(data_reservation);
        const startHour = new Date(date)
        startHour.setMinutes(0,0,0)

        const endHour = new Date(date);
        endHour.setMinutes(59,59,999)

        const query = "SELECT * FROM users WHERE id = ?";
        const [results] = await reservation.promise().query(query, [user_id]);
        if (!results || results.length === 0) throw new Error('User not found user:');
        const queryDate = "SELECT COUNT(*) AS total_reservations FROM reservation WHERE date_reservation >= ? AND date_reservation <= ?";
        const [resultDate] = await reservation.promise().query(queryDate, [startHour, endHour]);
        if (resultDate[0].total_reservations > 5) throw new Error('All dates already reserved');
        const queryInsert = "INSERT INTO reservation (details, user_id, date_reservation) VALUES (?, ?, ?)";
        const [result] = await reservation.promise().query(queryInsert, [details, user_id, data_reservation]);
        const queryGet = "SELECT * FROM reservation WHERE id = ?";
        const [newReservation] = await reservation.promise().query(queryGet, [result.insertId]);
        return newReservation[0]
    }

}

class Validation {
    static details(details) {
        if (!typeof details === 'string') throw new Error('Details need to be a string')
        if (details.length < 3) throw new Error('Details must be at least 3 characters long')
    }

}

module.exports = ReservationRepository