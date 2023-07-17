const express = require('express');
const { Op, sequelize } = require('sequelize');
const { Spot, Review, ReviewImage, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

//Get all reviews by current user
router.get('/current', requireAuth, async(req,res) => {
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        }
    });

    const newReviews = []

    for (let review of reviews) {
        const newReview = review.toJSON();

        //User attribute query
        const user = await User.findOne({
            where: {
                id: review.userId
            },
            attributes: ['id', 'firstName', 'lastName']
        });

        //Spot attribute query
        const spot = await Spot.findOne({
            where: {
                id: review.spotId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        //previewimage query in Spot attribute
        const prevImg = await SpotImage.findOne({
            where: {
                spotId: spot.id,
            },
        });
        let imageVal;
        if (!prevImg) {
            imageVal = null;
        } else {
            imageVal = prevImg.dataValues.url;
        };

        const newSpot = spot.toJSON();
        newSpot.previewImage = imageVal;

        //ReviewImage attribute query
        const reviewImages = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            },
            attributes: ['id', 'url'],
        });

        newReview.User = user;
        newReview.Spot = newSpot;
        newReview.ReviewImages = reviewImages;

        newReviews.push(newReview)
    };

    res.json({
        Reviews: newReviews
    })
});

//Add image to Review based on Review id
router.post('/:id/images', requireAuth, async(req, res) => {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        });
    };

    //Maximum number (10) images per review check
    const images = await ReviewImage.findAll({
        where: {
            reviewId: review.id
        }
    });

    if (images.length >= 10) {
        res.status(403);
        return res.json({
            message: "Maximum number of images for this resource was reached"
        });
    };

    if (review.userId !== req.user.id) {
        // const err = new Error('Review must be made by current user');
        res.status(404);
        return res.json({
            message: 'Review must be made by current user'
        })
    };

    const { url } = req.body;

    const newImage = await review.createReviewImage({
        url
    });

    const result = {
        id: newImage.id,
        url: newImage.url
    };

    res.json(result)
});

//Edit a review
router.put('/:id', requireAuth, validateReview, async(req, res) => {
    const rev = await Review.findByPk(req.params.id);

    if (!rev) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        });
    }

    if (rev.userId !== req.user.id) {
        res.status(404);
        return res.json({
            message: 'Review must be made by current user to edit'
        })
    };

    const { review, stars } = req.body;

    rev.update({
        review,
        stars
    });

    res.json(rev)
});

//Delete a review
router.delete('/:id', requireAuth, async(req, res) => {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        });
    };

    if (review.userId !== req.user.id) {
        res.status(403);
        return res.json({
            message: "Reviews can only be deleted by owner"
        })
    }

    review.destroy();

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;