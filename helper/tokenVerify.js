const jwt = require('jsonwebtoken');
const MyDb = require('../connect/connect');

const tokenVerify = async (req, res, next) => {
    const jwtSecret = process.env.JWT_SECRET;
    const token = req.headers.access_token

    if (!token) {
        return res.status(401).json({ error: 'No Token Found' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.user.email) {
            const sql = 'SELECT * FROM users WHERE email = ?';
            MyDb.query(sql, [decoded.user.email], (err, result) => {
                if (err) res.send({ error: err });
                if (result.length === 0) {
                    res.status(403).json({ error: 'Forbidden Access' });
                } else {
                    next()
                }
            });
        }
        else {
            res.send({ error: 'Access Denied' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
module.exports = tokenVerify