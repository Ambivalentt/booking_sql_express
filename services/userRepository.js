const db = require('../src/server.js')
const bcrypt = require('bcryptjs')

class UserRepository {
    static async create({ email_address, first_name, password }) {
        await Validation.email(email_address)
        Validation.name(first_name)
        const pw_hash = await bcrypt.hash(password, 10)
        const query = "INSERT INTO users (email_address, first_name, password_hash) VALUES (?, ?, ?)"
        const [result] = await db.promise().query(query, [email_address, first_name, pw_hash]);
        return result
    }

    static async login({ email_address, password }) {
        await Validation.email(email_address)
        const query = "SELECT * FROM users WHERE email_address = ?"
        const [result] = await db.promise().query(query, [email_address]);
        if (result.length === 0) throw new Error('incorrect email')
        const passwordDB = await bcrypt.compare(password, result[0].password_hash)
        if (!passwordDB) throw new Error('Incorrect password');
        const user = {
            id:result[0].id,
            email_address: result[0].email_address,
            first_name: result[0].first_name,
            create_at: result[0].create_at
        }
        return user;
    }

}



class Validation {
    static async email(email) {
        if (email.length < 3) throw new Error('Email must be at least 3 characters long')
        if (typeof email !== 'string') throw new Error('Email must be a string')

    }
    static name(first_name) {
        if (first_name.length < 3) throw new Error('Name must be at least 3 characters long')
        if (typeof first_name !== 'string') throw new Error('Name must be a string')
    }
}

module.exports = UserRepository