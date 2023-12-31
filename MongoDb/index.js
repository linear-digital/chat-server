const mongoose = require('mongoose');

const mongoHandler = () => {
    const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.n64rc8v.mongodb.net/bot-db?retryWrites=true&w=majority`

    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Get the default connection
    const db = mongoose.connection;

    // Bind connection to error event
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    // Bind connection to open event
    db.once('open', function () {
        console.log('Connected to MongoDB');

        // Your code here, e.g., define and use Mongoose models
    });
}

module.exports = mongoHandler