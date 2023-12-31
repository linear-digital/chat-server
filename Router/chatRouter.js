const MyDb = require('../connect/connect')
const router = require('express').Router()
const tokenVerify = require('../helper/tokenVerify');

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM chats';
    MyDb.query(sql, (err, result) => {
        if (err) res.send({ error: err })
        res.send(result)
    })
})

router.post('/get', async (req, res) => {
    const { sender, receiver } = req.body
    const sql = 'SELECT * FROM chats WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)';

    MyDb.query(sql, [sender, receiver, receiver, sender], (err, result) => {
        if (err) {
            res.send({ error: err })
        }
        res.send(result)
    })
})

router.post('/delete/:id', tokenVerify, async (req, res) => {
    const id = req.params.id
    const sql = 'UPDATE chats SET status = ? WHERE id = ?';
    MyDb.query(sql, ['deleted', id], (err, result) => {
        if (err) {
            res.send({ error: err })
        }
        res.send({result})
    })
})

module.exports = router