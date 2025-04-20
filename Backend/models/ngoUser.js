const mongoose = require('mongoose')

// mongoose.connect(`mongodb://127.0.0.1:27017/Web-Technology-Database`);

const ngoUser = mongoose.Schema({
    email : String,
    password : String
})

module.exports = mongoose.model('ngoUser', ngoUser);