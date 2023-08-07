const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');
const router = express.Router();

const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models')

const validateReview = [
    check('review').exists({ checkFalsy: true }).notEmpty().withMessage('Review text is required'),
    check('stars').exists({ checkFalsy: true }).notEmpty().isInt().isIn([1, 2, 3, 4, 5]).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]


router.get('/current', async (req, res) => {
    if(req.user) {


        const userReviews = await Review.findAll({
            where: {
                userId: req.user.id
            }
        })

        const userInfo = await User.scope({ method: ['getSpotOwner', req.user.id ] }).findOne({
            where: {
                id: req.user.id
            }
        })

        for(let review of userReviews) {

            review.dataValues.User = userInfo

            const spot = await Spot.scope({ method: ['getCurrentUserReviews', review.dataValues.spotId] }).findOne({
                where: {
                    id: review.dataValues.spotId
                }
            })

            review.dataValues.Spot = spot



            const previewImg = await SpotImage.findOne({
                where: {
                    spotId: review.dataValues.spotId,
                    preview: true
                }
            })

            if(previewImg) {
                spot.dataValues.previewImage = previewImg.dataValues.url
            }
            else {
                spot.dataValues.previewImage = null
            }

            const reviewImgs = await ReviewImage.findAll({
                where: {
                    reviewId: review.dataValues.id
                }
            })

            if(reviewImgs) {
                review.dataValues.ReviewImages = reviewImgs
            } else {
                review.dataValues.ReviewImages = null
            }
        }
        return res.json({ Reviews: userReviews })
    } else {
        res.status(401)
        res.json({ message: "Authentication required" })
    }
})


router.post('/:id/images', async (req, res) => {
    const { url } = req.body
    if(req.user) {
        const review = await Review.findOne({
            where: {
                id: req.params.id
            }
        })



        if(!review) {
            res.status(404)
            return res.json({
                message: "Review couldn't be found"
            })
        }

        if(review && review.dataValues.userId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        const reviewImgs = await ReviewImage.findAll({
            where: {
                reviewId: review.dataValues.id
            }
        })


        if(reviewImgs.length === 10) {
            res.status(403)
            return res.json({ message: "Maximum number of images for this resource was reached" })
        }

        if(review && review.dataValues.userId === req.user.id) {
            const reviewImage = await ReviewImage.create({
                reviewId: req.params.id,
                url: url
            })

            return res.json({ id: reviewImage.dataValues.id, url: reviewImage.dataValues.url })
        }

    } else {
        res.status(401)
        return res.json({ message: "Authorization required" })
    }
})

// <---------------------------- EDIT REVIEW ---------------------------->
router.put('/:id', validateReview, async (req, res) => {
    const { review, stars } = req.body
    if(req.user) {
        const reviewToEdit = await Review.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!reviewToEdit) {
            res.status(404)
            return res.json({ message: "Review couldn't be found" })
        }

        if(reviewToEdit && reviewToEdit.userId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        if(reviewToEdit && reviewToEdit.userId === req.user.id) {
            reviewToEdit.set({
                review: review || reviewToEdit.review,
                stars: stars || reviewToEdit.stars
            })

            await reviewToEdit.save()

            return res.json(reviewToEdit)
        }

    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }
})

// <---------------------------- DELETE REVIEW ---------------------------->
router.delete('/:id', async (req, res) => {
    if(req.user) {
        const review = await Review.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!review) {
            res.status(404)
            return res.json({ message: "Review couldn't be found" })
        }

        if(review && review.dataValues.userId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        if(review && review.dataValues.userId === req.user.id) {
            await review.destroy()
            res.json({ message: "Successfully deleted" })
        }
    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }

})


module.exports = router;