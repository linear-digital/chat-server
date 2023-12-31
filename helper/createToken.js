const jwt = require('jsonwebtoken');
const MyDb = require('../connect/connect');
const { userColumns } = require('./selectedColumns');
const jwtSecret = process.env.JWT_SECRET;
const createToken = (email) => {
    // Generate JWT access token


    const sql = `SELECT ${userColumns.join(', ')} FROM users WHERE email = ?`;


    MyDb.query(sql, [email], (err, result) => {
        if (err) console.log(err);
        if (result.length === 0) {
            return ""
        } else {
            const user = result[0]
            const accessToken = jwt.sign({ user: user }, jwtSecret, { expiresIn: '1d' });

            // Generate refresh token (store it in the database for later verification)
            const refreshToken = jwt.sign({ user: user }, jwtSecret);
            const token = {
                accessToken,
                refreshToken
            }
            // console.log(token)
            return token
        }
    });

}
module.exports = createToken