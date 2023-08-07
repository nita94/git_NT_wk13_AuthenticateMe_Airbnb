const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');
const router = express.Router();

const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models')


router.delete('/:id', async (req, res) => {
    if(req.user) {
        const reviewImg = await ReviewImage.scope({ method: ['deleteReviewImg', req.params.id] }).findOne({
            where: {
                id: req.params.id
            }
        })



        if(!reviewImg) {
            res.status(404)
            return res.json({ message: "Review Image couldn't be found" })
        }

        const reviewId = reviewImg.dataValues.reviewId


        const review = await Review.findOne({
            where: {
                id: reviewImg.dataValues.reviewId
            }
        })

        if(reviewImg && review.dataValues.userId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        if(reviewImg && review.dataValues.userId === req.user.id) {
            await reviewImg.destroy()
            return res.json({ message: "Successfully deleted" })
        }
        // res.send('working')

    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }
})

module.exports = router;