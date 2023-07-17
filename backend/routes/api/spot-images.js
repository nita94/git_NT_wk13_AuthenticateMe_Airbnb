const express = require('express');
const { Op, sequelize } = require('sequelize');
const { Spot, Review, SpotImage, User, ReviewImage, Booking, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

//Delete spot image by image id
router.delete('/:id', requireAuth, async(req, res) => {
    const image = await SpotImage.findByPk(req.params.id);

    if (!image) {
        res.status(404);
        return res.json({
            message: "Spot image couldn't be found"
        })
    }

    const spot = await Spot.findOne({
        where: {
            id: image.spotId
        }
    });


    if (spot.ownerId !== req.user.id) {
        res.status(404);
        return res.json({
            message: "Spot can only be edited by owner"
        })
    };

    image.destroy();

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;