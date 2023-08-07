const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');
const router = express.Router();

const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models')


const validateReview = [
    check('review').exists({ checkFalsy: true }).notEmpty().withMessage('Review text is required'),
    check('stars').exists({ checkFalsy: true }).notEmpty().isInt().isIn([1, 2, 3, 4, 5]).withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const validateBody = [
    check('address').exists({ checkFalsy: true }).notEmpty().withMessage('Street address is required'),
    check('city').exists({ checkFalsy: true }).notEmpty().withMessage('City is required'),
    check('state').exists({ checkFalsy: true }).notEmpty().withMessage('State is required'),
    check('country').exists({ checkFalsy: true }).notEmpty().withMessage('Country is required'),
    check('name').exists({ checkFalsy: true }).notEmpty().isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
    check('description').exists({ checkFalsy: true }).notEmpty().isLength({ min: 30 }).withMessage('Description is required'),
    check('description').isLength({ min: 30 }).withMessage('Please write 30 characters or more.'),
    check('price').exists({ checkFalsy: true }).notEmpty().withMessage('Price per day is required'),
    handleValidationErrors
];

router.get('/:id/bookings', async (req, res) => {
    if(req.user) {
        const spot = await Spot.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!spot) {
            res.status(404)
            return res.json({ message: "Spot couldn't be found" })
        }


        if(spot.ownerId === req.user.id) {
            const spotBookings = await Booking.findAll({
                where: {
                    spotId: spot.id
                }
            })

            for(let booking of spotBookings) {
                const user = await User.scope({ method: ['getSpotOwner', booking.userId] }).findOne({
                    where: {
                        id: booking.userId
                    }
                })
                booking.dataValues.User = user
            }
            res.json({ Bookings: spotBookings })


        }

        if(spot.ownerId !== req.user.id) {
            const spotBookings = await Booking.scope({ method: ['notOwner', spot.id] }).findAll({
                where: {
                    spotId: req.params.id
                }
            })

            res.json({ Bookings: spotBookings })
        }
    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }
})

router.post('/:id/bookings', async (req, res) => {
    const { startDate, endDate } = req.body
    if(req.user) {
        const spot = await Spot.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!spot) {
            res.status(404)
            res.json({ message: "Spot couldn't be found" })
        }

        if(spot && spot.ownerId === req.user.id) {
            res.status(403)
            res.json({ message: "Forbidden" })
        }

        const spotBookings = await Booking.findAll({
            where: {
                spotId: spot.id
            }
        })

        let errObj = {
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {}
        }

        const c1 = startDate.split("-");
        const c2 = endDate.split("-");

        const newBookStartYear = parseInt(c1[0])
        const newBookStartMonth = parseInt(c1[1]-1)
        const newBookStartDay = parseInt(c1[2])

        const newBookEndYear = parseInt(c2[0])
        const newBookEndMonth = parseInt(c2[1]-1)
        const newBookEndDay = parseInt(c2[2])

        const newBookStartDateObj = new Date(newBookStartYear, newBookStartMonth, newBookStartDay)
        const newBookEndDateObj = new Date(newBookEndYear, newBookEndMonth, newBookEndDay)



        if(spotBookings) {
            for(let booking of spotBookings) {
                const bookingStartDate = booking.startDate;
                const bookingEndDate = booking.endDate;

                const d1 = bookingStartDate.split("-");
                const d2 = bookingEndDate.split("-");

                const currBookStartYear = parseInt(d1[0])
                const currBookStartMonth = parseInt(d1[1]-1)
                const currBookStartDay = parseInt(d1[2])

                const currBookEndYear = parseInt(d2[0])
                const currBookEndMonth = parseInt(d2[1]-1)
                const currBookEndDay = parseInt(d2[2])


                const currBookStartDateObj = new Date(currBookStartYear, currBookStartMonth, currBookStartDay)
                const currBookEndDateObj = new Date(currBookEndYear, currBookEndMonth, currBookEndDay)


                if(newBookStartDateObj.getTime() >= currBookStartDateObj.getTime() && newBookStartDateObj.getTime() <= currBookEndDateObj.getTime()) {

                    errObj.errors.startDate = "Start date conflicts with an existing booking"
                }

                if(newBookEndDateObj.getTime() >= currBookStartDateObj.getTime() && newBookEndDateObj.getTime() <= currBookEndDateObj.getTime()) {

                    errObj.errors.endDate = "End date conflicts with an existing booking"
                }

            }
            if(errObj.errors.startDate || errObj.errors.endDate) {
                res.status(403)
                return res.json(errObj)
            }
        }
        
        if(newBookStartDateObj >= newBookEndDateObj) {
            res.status(400)
            return res.json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot be on or before startDate"
                }
            })
        }

        const newBooking = await Booking.create({
            spotId: spot.id,
            userId: req.user.id,
            startDate: startDate,
            endDate: endDate
        })

        return res.json(newBooking)

    } else {
        res.status(401)
        res.json({ message: "Authentication required" })
    }
});



// <---------------------------- ADD IMAGE TO A SPOT ---------------------------->
router.post('/:id/images', async (req, res) => {
    const { url, preview } = req.body
    if(req.user) {
        const spot = await Spot.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!spot) {
            res.status(404)
            return res.json({ message: "Spot couldn't be found" })
        }

        if(spot && spot.ownerId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        if(spot && spot.ownerId === req.user.id) {
            const newImage = await SpotImage.create({
                spotId: spot.id,
                url: url,
                preview: preview
            })

            res.json( {id: newImage.id, url: newImage.url, preview: newImage.preview} )
            return res.json(newImage)
        }

    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }
})

// <---------------------------- GET REVIEWS BY SPOT ID ---------------------------->
router.get('/:id/reviews', async (req, res) => {
    const spot = await Review.findOne({
        where: {
            id: req.params.id
        }
    })

    if(!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" })
    }

    const spotReviews = await Review.findAll({
        where: {
            spotId: req.params.id
        }
    })

    for(let review of spotReviews) {
        const user = await User.scope({ method: ['getSpotOwner', review.userId] }).findOne({
            where: {
                id: review.userId
            }
        })

        review.dataValues.User = user

        const reviewImgs = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            }
        })

        if(reviewImgs) {
            review.dataValues.ReviewImages = reviewImgs
        } else {
            review.dataValues.ReviewImages = null
        }
    }

    return res.json({ Reviews: spotReviews})


})

// <---------------------------- CREATE REVIEW BY SPOT ID ---------------------------->
router.post('/:id/reviews', validateReview, async (req, res) => {
    const { review, stars } = req.body
    if(req.user) {
        const spot = await Spot.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!spot) {
            res.status(404)
            return res.json({ message: "Spot couldn't be found" })
        }

        const checkForPrevReview = await Review.findOne({
            where: {
                userId: req.user.id,
                spotId: req.params.id
            }
        })

        if(checkForPrevReview) {
            res.status(500)
            return res.json({ message: "User already has a review for this spot" })
        } else {
            const newReview = await Review.create({
                userId: req.user.id,
                spotId: req.params.id,
                review: review,
                stars: stars
            })
            res.status(201)
            return res.json(newReview)
        }

        // if(!checkForPrevReview) {
        //     const newReview = await Review.create({
        //         userId: req.user.id,
        //         spotId: req.params.id,
        //         review: review,
        //         stars: stars
        //     })
        //     res.status(201)
        //     return res.json(newReview)
        // }

    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }
})


// <---------------------------- EDIT A SPOT ---------------------------->
router.put('/:id', validateBody, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    if(req.user) {
        const spot = await Spot.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!spot) {
            res.status(404)
            res.json({ message: "Spot couldn't be found" })
        }

        if(spot.ownerId !== req.user.id) {
            res.status(403)
            res.json({ message: "Forbidden" })
        }

        if(spot && spot.ownerId === req.user.id) {
            spot.set({
                address: address || spot.address,
                city: city || spot.city,
                state: state || spot.state,
                country: country || spot.country,
                lat: lat || spot.lat,
                lng: lng || spot.lng,
                name: name || spot.name,
                description: description || spot.description,
                price: price || spot.price
            })

            await spot.save()
            res.json(spot)
        }
    } else {
        res.status(401)
        res.json({ message: "Authentication required" })
    }
})


// <---------------------------- CREATE A SPOT ---------------------------->
router.post('/', validateBody, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    // const { user } = req;
    // if (user) {
    //     const safeUser = {
    //       id: user.id,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       email: user.email,
    //       username: user.username,
    //     }
    // }
    if(req.user) {
        const newSpot = await Spot.create({
            ownerId: req.user.id,
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
            // previewImage: previewImage
        })

        // const spotPrevImg = await SpotImage.create({
        //     url: previewImage,
        //     preview: true
        // })

        res.status(201)
        res.json(newSpot)


    } else {
        res.status(401)
        res.json({ message: "Authentication required" })
    }

    // } else {
    //     res.status(403)
    //     res.json({ message: "Forbidden" })
    // }

})



// <---------------------------- GET ALL SPOTS BY CURRENT USER ---------------------------->
router.get('/current', async (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        }

        const userSpots = await Spot.findAll({
            where: {
                ownerId: safeUser.id
            }
        })

        for (let spot of userSpots) {
            const reviews = await spot.getReviews()
            let sum = 0;
            for(let i = 0; i < reviews.length; i++) {
                sum += reviews[i].dataValues.stars
            }
            const avgRating = sum /reviews.length

            spot.dataValues.avgRating = avgRating.toFixed(2)

            const image = await SpotImage.findOne({
                where: {
                    spotId: spot.id,
                    preview: true
                }
            })
            if(image) {
                const imageUrl = image.dataValues.url
                spot.dataValues.previewImage = imageUrl
            } else {
                spot.dataValues.previewImage = null
            }
        }

        res.json({ Spots: userSpots })

    } else {
        res.status(401)
        res.json({ message: "Authentication required" })
    }
})




// <---------------------------- GET SPOT DETAILS BY ID ---------------------------->
router.get('/:id', async (req, res) => {
    const spot = await Spot.findOne({
        where: {
            id: req.params.id
        }
    })
    if(!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" })
    }

    const spotReviews = await spot.getReviews()
    spot.dataValues.numReviews = spotReviews.length

    let sum = 0;
    for(let i = 0; i < spotReviews.length; i++) {
        sum += spotReviews[i].dataValues.stars
    }
    spot.dataValues.avgRating = (sum / spotReviews.length).toFixed(2)
    // const previewImage = await SpotImage.findOne({
    //     where: {
    //         spotId: spot.id,
    //         preview: true
    //     }
    // })

    // spot.dataValues.previewImage = previewImage

    // const spotImages = await spot.getSpotImages()
    const spotImages = await SpotImage.findAll(
        {
        where: {
            spotId: spot.id
        }
    })


    if(spotImages) {
        spot.dataValues.SpotImages = spotImages
    }
    else {
        spot.dataValues.SpotImages = null
    }


    const spotOwner = await User.scope({ method: ['getSpotOwner', spot.ownerId] }).findOne({
        where: {
            id: spot.ownerId
        }
    })
    spot.dataValues.Owner = spotOwner

    res.json(spot)
})

// <---------------------------- GET ALL SPOTS ---------------------------->
router.get('/', async (req, res) => {
    const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    // const { page, size } = req.query
    let queryObj = {
        where: {},
        include: [],
        order: []
    };

    const errObj = {
        message: "Bad Request",
        errors: {}
    }

    if(page && page < 1) {
        errObj.errors.page = "Page must be greater than or equal to 1"
    }

    if(size && size < 1) {
        errObj.errors.size = "Size must be greater than or equal to 1"
    }

    if(maxLat && maxLat > 90) {
        errObj.errors.maxLat = "Maximum latitude is invalid"
    }

    if(minLat && minLat < -90) {
        errObj.errors.minLat = "Minimum latitude is invalid"
    }

    if(maxLng && maxLng > 180) {
        errObj.errors.maxLng = "Maximum longitude is invalid"
    }

    if(minLng && minLng < -1000) {
        errObj.errors.minLng = "Minimum longitude is invalid"
    }

    if(minPrice && minPrice < 0) {
        errObj.errors.minPrice = "Minimum price must be greater than or equal to 0"
    }

    if(maxPrice && maxPrice < 0) {
        errObj.errors.maxPrice = "Maximum price must be greater than or equal to 0"
    }

    if(errObj.errors.minLat || errObj.errors.maxLat || errObj.errors.minLng || errObj.errors.maxLng || errObj.errors.minPrice || errObj.errors.maxPrice) {
        res.status(400)
        return res.json(errObj)
    } else {
        if(maxLat) {
            queryObj.where.lat = {[Op.lte]: maxLat}
        }

        if(minLat) {
            queryObj.where.lat = {[Op.gte]: minLat}
        }

        if(maxLng) {
            queryObj.where.lng = {[Op.lte]: maxLng}
        }

        if(minLng) {
            queryObj.where.lng = {[Op.gte]: minLng}
        }

        if(maxPrice) {
            queryObj.where.price = {[Op.lte]: maxPrice}
        }

        if(minPrice) {
            queryObj.where.price = {[Op.gte]: minPrice}
        }

        const pageNum = req.query.page === undefined ? 1 : parseInt(req.query.page);
        const sizeNum = req.query.size === undefined ? 20 : parseInt(req.query.size);
        if (pageNum >= 1 && sizeNum >= 1) {
            queryObj.limit = sizeNum;
            queryObj.offset = sizeNum * (pageNum - 1);
        }

        const allSpots = await Spot.findAll(queryObj)

        for (let spot of allSpots) {
            const reviews = await spot.getReviews()
            let sum = 0;
            for(let i = 0; i < reviews.length; i++) {
                sum += reviews[i].dataValues.stars
            }

            const avgRating = sum /reviews.length
            // const avgRating = reviews[0].dataValues.stars / reviews.length
            spot.dataValues.avgRating = avgRating.toFixed(2)

            const image = await SpotImage.findOne({
                where: {
                    spotId: spot.id,
                    preview: true
                }
            })

            if(image) {
                // let imgArr = []
                // if(image.length > 1) {
                //     for(let i = 0; i < image.length; i++) {
                //         imgArr.push(image[i].dataValues.url)
                //     }
                //     spot.dataValues.previewImage =
                // } else {

                // }
                // const allSpotImages = await SpotImage.findAll()

            const imageUrl = image.dataValues.url
            spot.dataValues.previewImage = imageUrl
            } else {
                spot.dataValues.previewImage = null
            }
        }
        // const returnObj = { Spots: allSpots, page:  }

        res.json({ Spots: allSpots, page: pageNum, size: sizeNum })
    }
})


// <---------------------------- DELETE A SPOT ---------------------------->
router.delete('/:id', async (req, res) => {
    if(req.user) {
        const spot = await Spot.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!spot) {
            res.status(404)
            res.json({ message: "Spot couldn't be found" })
        }

        if(spot.ownerId !== req.user.id) {
            res.status(403)
            res.json({ message: "Forbidden" })
        }

        if(spot && spot.ownerId === req.user.id) {
            await spot.destroy()
            res.json({ message: "Successfully deleted" })
        }

    } else {
        res.status(401)
        res.json({ message: "Authentication required" })
    }
})

router.use((err, req, res, next) => {
    if (err.name === "SequelizeValidationError") {
        const errors = err.errors.map(e => e.message);
        return res.status(400).json({ title: "Bad request", errors: errors });
    }
    return next(err);
});


module.exports = router;