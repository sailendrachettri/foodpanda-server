const express = require('express');
const Menu = require('../models/menu.models');

const router = express.Router();

router.post('/additem', async(req, res)=>{
    const {itemname, price, description} = req.body;

    // check for empty fields
    if(!(itemname && price && description)){
        return res.status(404).json({success: false, message: "All fields are requried"});
    }

    try {
        const items = await Menu.create({itemname, price, description});

        res.status(200).json({success: true, message: "Item added successfully", items})

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
})

module.exports = router