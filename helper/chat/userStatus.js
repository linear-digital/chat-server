const MyDb = require('../../connect/connect')

const userStatus = (email, status) => {

    if (email && status === 'online') {
        const sql = 'UPDATE users SET status = ? WHERE email = ?';
        MyDb.query(sql, ['online', email], (err, result) => {
            if (err) console.log(err)
            console.log("User Online")
        })
    }
    else {
        const sql = 'UPDATE users SET status = ? WHERE email = ?';
        MyDb.query(sql, ['offline', email], (err, result) => {
            if (err) console.log(err)
            console.log("User Offiline")
        })
    }

}

module.exports = userStatus