const MyDb = require('../connect/connect');
const { userColumns } = require('../helper/selectedColumns');

const router = require('express').Router()


router.post('/', (req, res) => {
    const data = req.body
    const sql = 'INSERT INTO friendlist (user_email, friend_email) VALUES (?, ?)';
    MyDb.query(sql, [data.user_email, data.friend_email], (err, result) => {
        if (err) res.send({ error: err })
        res.send(result)
    })
})

router.get('/:email', (req, res) => {
    const sql = 'SELECT * FROM friendlist WHERE user_email = ?';
    MyDb.query(sql, [req.params.email], (err, result) => {
        if (err) res.send({ error: err })
        res.send(result)
    })
})

router.post('/getFriend', (req, res) => {
    const query = `SELECT ${userColumns.join(', ')} FROM users WHERE email IN (?)`;
    const emails = req.body.emails

    MyDb.query(query, [emails], (err, result) => {
        if (err) res.send({ error: err })
        res.send(result)
    })
})

router.delete('/', (req, res) => {
    const { user_email, friend_email } = req.body
    const sql = 'DELETE FROM friendlist WHERE user_email = ? AND friend_email = ?';
    MyDb.query(sql, [user_email, friend_email], (err, result) => {
        if (err) res.send({ error: err })
        res.send(result)
    })
})

module.exports = router