const express = require('express');
const Users = require('../models/user.models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();


// ROUTE 1: USER REGISTRATION
router.post('/signup', async (req, res) => {
    let success = false;

    const {fullname, password, cpassword, email, phone} = req.body

    try {

        let user = await Users.findOne({email});


        // compare password with compirm password
        if (!(password === cpassword))
            return res.status(400).json({ success: false, message: "Password doesn't match" })

        // if user exist the send the response that user already exist
        if (user) {
            res.status(400).json({ success, message: " email already exist" });

        } else {
            success = true;

            user = await Users.create({
                fullname,
                email,
                password: bcryptjs.hashSync(password, 10),
                phone
            })

            // jwt token generation
            const data = {
                    id: user.id,
                    fullname,
            }
            const auth_token = jwt.sign(data, process.env.JWT_SECRET_KEY);

            res.cookie('jwt_token', auth_token);
            res.status(200).json({ success: true, message: "Registration successful!", auth_token, username: user.username })
        }

    } catch (error) {
        res.status(500).json(error.message);
        // res.status(500).send("Internal server error");
    }
})


// ROUTE 2: User login
router.post('/login', async (req, res) => {
    let success = false;

    const {email, password} = req.body;

    try {
      

        let user = await Users.findOne({email});

        // if user doesn't exist 
        if (!user)
            return res.status(404).json({ success, message: "User doesn't exist. Try registration first!" });

        // compare user entered password with hash password if it false the return
        if (!(bcryptjs.compareSync(password, user.password)))
            return res.status(400).json({ success, message: "Invalid email or password" });

        // jwt authentication 
        const data = {
            id: user.id,
            email
        }
        const auth_token = jwt.sign(data, process.env.JWT_SECRET_KEY);

        // below secure: true and sameSite: none is very important in production 
        res.cookie('auth_token', auth_token, {
            secure: true,
            sameSite: 'none',

        }).status(200).json({
            id: user._id,
            email
        });

    } catch (error) {
        res.status(500).json({ success, message: "Internal server errrrror", error: error.message });
    }
})

// ROUTE 3: Get all the user information (LOGGED IN)
router.get('/profile', async(req, res) => {
    let success = false;
    const { auth_token } = req.cookies;

    try {
        success = true;
        const userInfo = jwt.verify(auth_token, process.env.JWT_SECRET_KEY);

        // get the user detials expect password
        // const user = await Users.findById(userInfo.id).select("-password");

        // res.status(200).json({success: true, userInfo, user: user});
        res.status(200).json(userInfo);

    } catch (err) {
        success = false;
        res.status(500).json({ success, message: "Internal server errorrr", error: err.message })
    }
})

// ROUTE 4: Handle logout
router.post('/logout', (_, res) => { // if the req is not required the we can use underscore
    try {
        res.clearCookie('auth_token', {
            sameSite: 'none',
            secure: true
        }).json({success: true, message: "Auth Token replaced with empty string"}); // removing auth_token from cookie
    } catch (err) {
        res.status(500).json({meccess: false, message: err.message});
    }
})

module.exports = router
