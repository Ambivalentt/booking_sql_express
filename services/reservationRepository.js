const reservation = require('../src/server.js')

class ReservationRepository {
    static async create({ details, user_id, data_reservation }) {
        Validation.details(details) //validacion details 

        const user = await this.getUserById(user_id)
        if (!user) throw new Error(`Uset with id ${user_id} not found`)

        const [startHour, endHour] = this.getHourRange(data_reservation) //traemos la hora de inicio y final

        const reservationCount = await this.countReservationsInHour(startHour, endHour) //agregamos la consulta de la hora
        if(reservationCount >= 5) throw new Error('No more than 5 reservations per hour') //validamos si no hay mas de 5 resevaciones por hora

        const query = "INSERT INTO reservation (details, user_id, date_reservation) VALUES (?, ?, ?)"
        const [result] = await reservation.promise().query(query,[details, user_id, data_reservation]);
        
        return await this.getReservationById(result.insertId)
    }

    static getHourRange(datetime) {
        const date = new Date(datetime);
        const start = new Date(date)
        start.setMinutes(0, 0, 0)

        const end = new Date(date);
        end.setMinutes(59, 59, 999)
        return [start, end]
    }

    static async getUserById(id) {
        const userQuery = "SELECT * FROM users WHERE id = ?";
        const [user] = await reservation.promise().query(userQuery, [id]);
        return user || null
    }

    static async countReservationsInHour(start, end) {
        const countQuery = `
          SELECT COUNT(*) AS total
          FROM reservation
          WHERE date_reservation >= ? AND date_reservation <= ?
        `;
        const [results] = await reservation.promise().query(countQuery, [start, end]);
        return results[0].total;
    }

    static async getReservationById(reservationId) {
        const selectQuery = "SELECT * FROM reservation WHERE id = ?";
        const [reservations] = await reservation.promise().query(selectQuery, [reservationId]);
        return reservations[0] || null;
    }
}

class Validation {
    static details(details) {
        if (!typeof details === 'string') throw new Error('Details need to be a string')
        if (details.length < 3) throw new Error('Details must be at least 3 characters long')
    }

}

module.exports = ReservationRepository