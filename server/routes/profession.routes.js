const express =require('express')
const Profession = require('../models/Profession')
const router = express.Router({mergeParams: true})

router.get('/', async (req, res) => {
    try {
        const list = await Profession.find()
        res.send(list)
    } catch (e) {
        res.status(500).json({
            message: 'Some problem occured on server. Try it later'
        })
    }
})



module.exports = router