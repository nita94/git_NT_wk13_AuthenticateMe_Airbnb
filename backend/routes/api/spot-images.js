const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');
const router = express.Router();

const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models')

router.delete('/:id', async (req, res) => {
    if(req.user) {
        const spotImg = await SpotImage.scope({ method: ['deleteImage', req.params.id] }).findOne({
            where: {
                id: req.params.id
            }
        })

        if(!spotImg) {
            res.status(404)
            return res.json({ message: "Spot Image couldn't be found" })
        }

        const spotId = spotImg.dataValues.spotId

        const spot = await Spot.findOne({
            where: {
                id: spotId
            }
        })

        if(spotImg && spot.dataValues.ownerId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        if(spotImg && spot.dataValues.ownerId === req.user.id) {
            await spotImg.destroy()
            return res.json({ message: "Successfully deleted" })
        }

    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }
})

module.exports = router;