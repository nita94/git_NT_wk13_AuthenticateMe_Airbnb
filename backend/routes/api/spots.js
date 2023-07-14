const express = require('express');
const { Op, Sequelize, ValidationError } = require('sequelize');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required.'),
    check('city')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .isNumeric()
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .isNumeric()
      .withMessage('Longitude is not valid'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
    check('price')
      .isNumeric()
      .withMessage('Price must be a number'),
    handleValidationErrors
];

const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('review')
      .isLength({ min: 30 })
      .withMessage('Description must be at least 30 characters'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const validateQuery = [
    check('page')
      .optional()
      .exists({ checkFalsy: true })
      .isInt({min: 1, max: 10}),
    check('size')
      .optional()
      .exists({ checkFalsy: true })
      .isInt({min: 1, max: 20}),
    check('minLat')
      .optional()
      .isDecimal(),
    check('maxLat')
      .optional()
      .isDecimal(),
    check('minLng')
      .optional()
      .isDecimal(),
    check('maxLng')
      .optional()
      .isDecimal(),
    check('minPrice')
      .optional()
      .isDecimal(),
    check('maxPrice')
      .optional()
      .isDecimal(),
    handleValidationErrors
];

//Verify spot belongs to current user
const verifySpot = async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    };

    next()
};

//Get all spots
router.get('/', validateQuery, async(req, res) => {
    const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const limit = size;
    const offset = size * (page - 1);

    const whereClause = {};

    if (minLat) {
        whereClause.lat = { [Sequelize.Op.gte]: minLat };
    }

    if (maxLat) {
        whereClause.lat = { ...whereClause.lat, [Sequelize.Op.lte]: maxLat };
    }

    if (minLng) {
        whereClause.lng = { [Sequelize.Op.gte]: minLng };
    }

    if (maxLng) {
        whereClause.lng = { ...whereClause.lng, [Sequelize.Op.lte]: maxLng };
    }

    if (minPrice) {
        whereClause.price = { [Sequelize.Op.gte]: minPrice };
    }

    if (maxPrice) {
        whereClause.price = { ...whereClause.price, [Sequelize.Op.lte]: maxPrice };
    }

    console.log(whereClause)

    const spots = await Spot.findAll({
        order: ['id'],
        limit: limit,
        offset: offset,
        where: whereClause
    });

    let newSpots = []

    for (let spot of spots) {
        let newSpot = spot.toJSON()

        const reviewCount = await Review.count({
            where: {
                spotId: spot.id
            }
        });

        const sumRatings = await Review.sum('stars', {
            where: {
                spotId: spot.id
            }
        });

        const avgRating = sumRatings / reviewCount;

        const image = await SpotImage.findOne({
            where: {
                spotId: spot.id,
            }
        });

        let imageVal;
        if (!image) {
            imageVal = null;
        } else {
            imageVal = image.dataValues.url;
        }

        newSpot.avgRating = avgRating;
        newSpot.previewImage = imageVal;

        newSpots.push(newSpot);
    };

    res.json({
        Spots: newSpots,
        page: page,
        size: size
    });
});

//Get all spots owned by current user
router.get('/current', requireAuth, async(req, res) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        order: ['id'],
        attributes: {
            exclude: ['description']
        }
    });

    let newSpots = []

    for (let spot of spots) {
        let newSpot = spot.toJSON()

        const reviewCount = await Review.count({
            where: {
                spotId: spot.id
            }
        });

        const sumRatings = await Review.sum('stars', {
            where: {
                spotId: spot.id
            }
        });

        const avgRating = sumRatings / reviewCount;

        const image = await SpotImage.findOne({
            where: {
                spotId: spot.id,
            }
        });

        let imageVal;
        if (!image) {
            imageVal = null;
        } else {
            imageVal = image.dataValues.url;
        }

        newSpot.avgRating = avgRating;
        newSpot.previewImage = imageVal;

        newSpots.push(newSpot);
    };

    res.json({
        Spots: newSpots
    });
});

//Get details of a Spot from an id
router.get('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    };

    const reviewCount = await Review.count({
        where: {
            spotId: req.params.id
        }
    });

    const sumRatings = await Review.sum('stars', {
        where: {
            spotId: req.params.id
        },
    });

    const avgRating = sumRatings / reviewCount;

    const images = await SpotImage.findAll({
        where: {
            spotId: req.params.id
        },
        attributes: {
            exclude: ['spotId']
        },
    });

    const owner = await User.findOne({
        where: {
            id: spot.ownerId
        },
        attributes: ['id', 'firstName', 'lastName']
    });

    const result = {
        id: spot.id,
        ownerId: spot.ownerId,
        name: spot.name,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: reviewCount,
        avgStarRating: avgRating,
        SpotImages: images,
        Owner: owner
    }

    res.json(result);
});

//Create a spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    res.json(newSpot)
});

//Add an image to Spot based on Spot id
router.post('/:id/images', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        });
    };

    if (req.user.id !== spot.ownerId) {
        res.status(404);
        return res.json({
            "Error": "Spot must belong to current user"
        });
    };

    const { url, preview } = req.body;
    const newImage = await spot.createSpotImage({
        url,
        preview
    });

    const response = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }

    // res.json(newImage)
    res.json(response)
});

//Edit a spot
router.put('/:id', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        });
    };

    if (req.user.id !== spot.ownerId) {
        res.status(404);
        return res.json({
            "Error": "Spot must belong to current user"
        });
    };

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const updatedSpot = await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    res.json(updatedSpot)
});

//Delete a spot
router.delete('/:id', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        });
    };

    if (spot.ownerId !== req.user.id) {
        res.status(403);
        return res.json({
            message: "Spot can only be deleted by owner"
        })
    }

    spot.destroy();

    res.json({
        "message": "Successfully deleted"
    })
});

//Get all Reviews by a Spot's id
router.get('/:id/reviews', async(req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        });
    };

    const reviews = await Review.findAll({
        where: {
            spotId: req.params.id
        }
    });

    const newReviews = [];

    for (let review of reviews) {
        const newReview = review.toJSON();

        const user = await User.findByPk(review.userId, {
            attributes: {
                exclude: ['username']
            }
        });

        const images = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            },
            attributes: ['id', 'url']
        });

        newReview.User = user;
        newReview.ReviewImages = images;

        newReviews.push(newReview)
    };

    res.json({
        Reviews: newReviews
    });
});

//Create a review by spot's id
router.post('/:id/reviews', requireAuth, validateReview, async(req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        });
    };

    const oldReview = await Review.findAll({
        where: {
            userId: req.user.id,
            spotId: spot.id
        }
    });
    // console.log(oldReview)

    if (oldReview.length >= 1) {
        res.status(500);
        return res.json({
            message: "User already has a review for this spot"
        });
    };

    const { review, stars } = req.body;

    const newReview = await spot.createReview({
        userId: req.user.id,
        spotId: req.params.id,
        review,
        stars
    });

    res.json(newReview);
});

//Get all bookings for spot by spotId
router.get('/:id/bookings', requireAuth, async(req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        });
    };

    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.id
        }
    });

    const arr = [];

    for (let booking of bookings) {
        const newBooking = booking.toJSON();

        const user = await User.findOne({
            where: {
                id: booking.userId
            },
            attributes: ['id', 'firstName', 'lastName']
        });

        let result = {};

        if (req.user.id === spot.ownerId) {
            result.User = user,
            result.id = booking.id;
            result.spotId = booking.spotId;
            result.startDate = booking.startDate;
            result.endDate = booking.endDate;
            result.createdAt = booking.createdAt;
            result.updatedAt = booking.updatedAt;
        } else {
            result.spotId = booking.spotId;
            result.startDate = booking.startDate;
            result.endDate = booking.endDate;
        }

        arr.push(result)
    }


    res.json({
        Bookings: arr
    })
});

//Create a booking by spotId
router.post('/:id/bookings', requireAuth, async(req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        });
    };

    if (spot.ownerId === req.user.id) {
        res.status(403);
        return res.json({
            "message": "Spot cannot be booked by owner"
        })
    };

    const { startDate, endDate } = req.body;

    const existingBooking = await Booking.findOne({
        where: {
            spotId: req.params.id,
            [Sequelize.Op.or]: [
                {
                  startDate: {
                    [Sequelize.Op.lte]: endDate
                  },
                  endDate: {
                    [Sequelize.Op.gte]: startDate
                  }
                }
              ],

        }
    });

    if (existingBooking) {
        res.status(400);
        return res.json({
            message: `This spot is unavailable from ${existingBooking.startDate} to ${existingBooking.endDate}`,
        })
    };

    const newBooking = await Booking.create({
        spotId: spot.id,
        userId: req.user.id,
        startDate,
        endDate
    });

    res.json(newBooking)
});

module.exports = router;