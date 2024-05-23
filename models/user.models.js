
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },

    email : {
        type : String,
        unique: true,
        required : true
    },

    password : {
        type : String,
        required : true
    },

    phone : {
        type : String,
        required : true
    }
})
const Users = new mongoose.model("User", UserSchema);
module.exports = Users