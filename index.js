const express = require('express')
const http = require('http')
const MyDb = require('./connect/connect')
const { error } = require('./helper/handler')
const path = require('path')
const bodyParser = require('body-parser')
const { createTableQuery, createTableChat, createTableFriendList } = require('./query/createTableQuery')
const app = express()
const Store = require('./model/Data')
require('dotenv').config()

app.use(require("cors")({ origin: "*" }));
app.use(bodyParser.json())

//Socket.io
const { Server } = require('socket.io');
const userStatus = require('./helper/chat/userStatus')
const { upload2 } = require('./helper/multerStorage')
const mongoHandler = require('./MongoDb')

// Socket.io

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    userStatus(socket.handshake.query.email, "online");
    io.emit('connected-user', socket.handshake.query.email);

    socket.on('send-message', (data) => {
        console.log(data)
    })

    socket.on('new_message', (data) => {
        const query = 'INSERT INTO chats (sender, receiver, message, type, image, imageTitle, document, fileSize, fileName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        MyDb.query(query, [data.sender, data.receiver, data.message, data.type, data.image, data.imageTitle, data.document, data.fileSize, data.fileName], (err, result) => {
            if (err) error(err)
            io.emit("message", data);
        })
    })

    socket.on('disconnect', () => {
        userStatus(socket.handshake.query.email, "offline");
        io.emit('disconnectd-user', socket.handshake.query.email);
    });
});



//upload image

app.post('/api/upload-image', upload2.single("image"), (req, res) => {
    const image = `${req.protocol}://${req.get('host')}/images/chat/${req.file.filename}`;
    res.send({ image })
})

// console.log("")

// Connect Database
const connectDB = () => {
    MyDb.connect((err) => {
        if (err) error(err)
        console.log("Database Connected Success")
        MyDb.query(createTableQuery, (err) => {
            if (err) error(err)
            console.log("Users Table Created/Exist")
        })
        //Create Chats Table
        MyDb.query(createTableChat, (err) => {
            if (err) error(err)
            console.log("Chat Table Created/Exist")
        })
        //Create Friend List Table
        MyDb.query(createTableFriendList, (err) => {
            if (err) error(err)
            console.log("Friend List Table Created/Exist")
        })

    })
}

app.post('/drop', (req, res) => {
    const DB_Name = req.body.DB_Name
    MyDb.query(`DROP TABLE ${DB_Name}`, (err) => {
        if (err) error(err)
        res.send(`${DB_Name} Table Drop Success`)
    })
})

// app.get('/', (req, res) => {
//     res.send("Server Running")
// })
app.use(express.static('public'))
app.use('/images', express.static('./uploads'))
app.use('/images/chat', express.static('./uploads/chat'))

app.use('/api/users', require('./Router/usersRouter'))
app.use('/api/friendlist', require('./Router/friendRouter'))
app.use('/api/chats', require('./Router/chatRouter'))
app.use('/api/chat-bot', require('./Router/chatGPT'))
app.use('/api/bot', require('./Router/bot/chat'))


const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB()
    mongoHandler()
});

