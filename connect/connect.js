const mysql = require('mysql')

const MyDb = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "chat-app",
    charset: 'utf8mb4',
})

module.exports = MyDb