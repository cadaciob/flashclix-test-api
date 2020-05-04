const mongoose = require('mongoose')

// mongodb+srv://htlwienwesterUser:htlwienwestPass@cluster0-6kjju.mongodb.net/flashclix-test-api2?retryWrites=true&w=majority

const db = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/flashclix-api'

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
