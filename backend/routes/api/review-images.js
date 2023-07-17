const express = require('express');
const { Op, sequelize } = require('sequelize');
const { Spot, Review, SpotImage, User, ReviewImage, Booking, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

//Delete a review image
router.delete('/:id', requireAuth, async(req, res) => {
    const image = await ReviewImage.findByPk(req.params.id);

    if (!image) {
        res.status(404);
        return res.json({
            message: "Review Image couldn't be found"
        })
    };

    const review = await Review.findOne({
        where: {
            id: image.reviewId
        }
    });

    if (review.userId !== req.user.id) {
        res.status(403);
        return res.json({
            message: "Images can only be deleted by the review owner"
        })
    }

    image.destroy();

    res.json({
        message: "Successfully deleted"
    });
})

module.exports = router;