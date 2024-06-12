const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
    user: String,
    id:String,
    password:String
})

const LoginModel = mongoose.model('logins', loginSchema)

module.exports = LoginModel