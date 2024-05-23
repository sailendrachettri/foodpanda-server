
const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema({
    itemname : {
        type : String,
        required : true
    },

    price : {
        type : Number,
        required : true
    },

    description : {
        type : String,
        required : true
    }
})
const Menu = new mongoose.model("Menu", MenuSchema);
module.exports = Menu