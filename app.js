const express = require('express');

const db = require("./database")
const app = express();
const cors = require('cors')
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 8000
app.use(cookieParser());
app.use(express.json());
app.use(cors({credentials: true, origin: process.env.DEVELOPMENT_URL}))

app.use("/api/auth/user", require('./routes/auth'));
app.use("/api/dishes/menu", require('./routes/menu'));

app.listen(PORT, ()=>{
    console.log("Listining at port ", PORT);
})