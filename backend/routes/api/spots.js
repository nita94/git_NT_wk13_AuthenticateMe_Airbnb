const express = require('express')
const { check } = require('express-validator');
const{requireAuth} = require('../../utils/auth')
const { Op } = require('sequelize')
const { handleValidationErrors } = require('../../utils/validation');

const { User, Spot, SpotImage, Review, ReviewImage, sequelize, Booking } = require('../../db/models');

const router = express.Router();


router.post('/:spotId/bookings', requireAuth, async (req, res, next) =>{
    const currentUser = req.user.id;
    const spotId = req.params.spotId;
    const {startDate, endDate} = req.body;
    const spot = await Spot.findByPk(spotId);

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        });
    }

    if(spot.ownerId === currentUser){
        return res.status(403).json({
            "message": "Owners cannot book spots that belong to them"
        })
    }

    if (new Date(endDate) <= new Date(startDate)){
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }

    const conflictingBooking = await Booking.findOne({
        where: {
            spotId: spotId,
            [Op.or]: [
                {
                    startDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                {
                    endDate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            ]
        }
    })

    if(conflictingBooking){
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        })
    }
    try {
        const newBooking = await Booking.create({
            userId: currentUser,
            spotId: spotId,
            startDate: startDate,
            endDate: endDate
        });

        return res.status(201).json({
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: newBooking.startDate,
            endDate: newBooking.endDate,
            createdAt: newBooking.createdAt,
            updatedAt: newBooking.updatedAt
        });
    } catch (err) {
        next(err);
    }
});


router.get('/current', requireAuth, async (req, res, next) => {

    const userId = req.user.id;

    const allSpots = await Spot.findAll({
        where: { ownerId: userId },

    });

    const spotsWithImagesAndRating = await Promise.all(
        allSpots.map(async (spot) => {
            const images = await SpotImage.findAll({
                where : { spotId: spot.id },
            });

            const averageRating = await spot.getAverageRating();
            return {
                ...spot.get(),
                avgRating: averageRating,
                previewImage: images.length > 0 ? images[0].url : null,
            };
        })
    );

    res.json({ Spots: spotsWithImagesAndRating });
});

router.get('/:spotId/reviews', async (req, res, next)=> {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if(!spot){
        return res.status(404).json({"message": "Spot couldn't be found"})
    }
    const reviews = await Review.findAll({
                where: { spotId: spotId},
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: ReviewImage,
                        as: 'ReviewImages'
                    }
                ]
            });
       const reviewsWithDetails = reviews.map((review) => {
        const user = review.User;
        const reviewImages = review.ReviewImages.map((image) => {
            return {
                id: image.id,
                url: image.url,
            };
        });
        return {
            ...review.get(),
            User: user,
            ReviewImages: reviewImages,
        }
       })
       res.json({Reviews: reviewsWithDetails})
    })



router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const foundSpot = req.params.spotId;
    const userId = req.user.id;
    const spot = await Spot.findOne({
        where: {id: foundSpot},
        include: [

            {
                model: Booking,
                include: [{
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                }]

            }
        ]
    })
    if (!spot){
        res.status(404).json({
            "message": "Spot couldn't be found"
           })
    }
    if (spot.ownerId === userId) {

        const detailedBookings = spot.Bookings.map(booking => {
            return {
                User: {
                    id: booking.User.id,
                    firstName: booking.User.firstName,
                    lastName: booking.User.lastName,
                },
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }
        });
        return res.json({ "Bookings": detailedBookings });
    }

    const simplifiedBookings = spot.Bookings.map(booking => {
        return {
            "spotId": booking.spotId,
            "startDate": booking.startDate,
            "endDate": booking.endDate
        }
    });

    res.json({ "Bookings": simplifiedBookings });
});


router.get('/:spotId', async (req, res, next) => {
    const foundSpot = req.params.spotId;

    const spotById = await Spot.findByPk(foundSpot, {
        include: [
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
            }
        ]
    })
    if(!spotById){
       res.status(404).json({
        "message": "Spot couldn't be found"
       })
    } else {
        const images = await SpotImage.findAll({
            where: { spotId: spotById.id, preview: true},
        })
        const averageRating = await spotById.getAverageRating();
        const numReviews = await spotById.getNumReviews();
        const spotData = {
            ...spotById.get(),
            avgRating: averageRating,
            numReviews: numReviews,
            SpotImages: images.map(image => ({
                id: image.id,
                url: image.url,
                preview: image.preview,
            }))
        };

        res.json(spotData);
    }
});


const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]
router.post('/:spotId/reviews', validateReview, requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;

    const selectedSpot = await Spot.findByPk(spotId)
    if(!selectedSpot){
        res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }
    const existingReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: userId
        }
      });

      if (existingReview) {
        return res.status(500).json({
          "message": "User already has a review for this spot"
        });
      }
    const { review, stars } = req.body;
    const newReview = await Review.create({userId, spotId, review, stars})

    return res.status(201).json(newReview)
})

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const currentUser = req.user.id;
    const selectedSpotId = req.params.spotId;
    const selectedSpot = await Spot.findByPk(selectedSpotId);
    if(!selectedSpot){
        res.status(404).json({
            "message": "Spot couldn't be found"
           })
    }
    const {url, preview} = req.body;
    const owner = selectedSpot.ownerId

    if(currentUser !== owner) {
        res.status(403).json({
            "message": "Current user is prohibited from accessing the selected data"
        })
    }
    const newSpotImage = await SpotImage.create({spotId: selectedSpotId, url, preview})
    return res.status(201).json(newSpotImage)
})


const validatePost = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .withMessage('Longitude is not valid'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({min: 1, max: 50})
      .withMessage('Name must be between 1 and 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
    handleValidationErrors
  ];



router.post('/', validatePost, requireAuth, async (req, res, next) => {
    const  { address, city, state, country, lat, lng, name, description, price} = req.body;
    const ownerId = req.user.id;
    const newSpot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price});
    return res.status(201).json(newSpot)
})


router.put('/:spotId', requireAuth, async (req, res, next) => {
    const currentUser = req.user.id;
    const selectedSpotId = req.params.spotId;
    const editedSpot = await Spot.findByPk(selectedSpotId);


    let errors = {}
    if(!editedSpot){
        res.status(404).json({
            "message": "Spot couldn't be found"
           })
    }
    const owner = editedSpot.ownerId
    if(currentUser !== owner) {
        res.status(403).json({
            "message": "Current user is prohibited from accessing the selected data"
        })
    }

    try {
    const  { address, city, state, country, lat, lng, name, description, price} = req.body;
    if(address !== undefined) {
        if(address.trim() === '') errors.address = 'Street address is required';
       else editedSpot.address = address;
    }
    if(city !== undefined) {
        if(city.trim() === '') errors.city = 'City is required';
       else editedSpot.city = city;
    }
    if(state !== undefined) {
        if(state.trim() === '') errors.state = 'State is required';
       else editedSpot.state = state;
    }
    if(country !== undefined) {
        if(country.trim() === '') errors.country = 'Country is required';
      else  editedSpot.country = country;
    }
    if(lat !== undefined) {
        if(lat == '') errors.lat = 'Latitude is not valid';
       else editedSpot.lat = lat;
    }
    if(lng !== undefined) {
        if(lng == '') errors.lng = 'Longitude is not valid';
       else editedSpot.lng = lng;
    }
    if (name !== undefined) {
        if(name.trim() === '' || name.length < 1 || name.length > 50){
            errors.name = 'Name must be between 1 and 50 characters';
        }
        else editedSpot.name = name;
    }
    if(description !== undefined) {
        if(description.trim() === '') errors.description = 'Description is required';
        else editedSpot.description = description;
    }
    if(price !== undefined) {
        if(price == '') errors.price = 'Price per day is required';
        else editedSpot.price = price;
    }
    if(errors.length > 0) return res.status(400).json({errors})

    const newSpot = await editedSpot.save();


    if(Object.keys(errors).length > 0){
        return res.status(400).json({
            "message": "Bad Request",
            "errors": errors
        })
    }
    return res.json(newSpot)
} catch (err){
    return res.status(404).json({
        error: err.message
    })
}

})


router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
           })
    }
    const owner = spot.ownerId;
    const currentUser = req.user.id;
    if(owner !== currentUser){
        return res.status(403).json({
            "message": "Current user is prohibited from accessing the selected data"
        })
    }
    await spot.destroy();
    return res.json({
        "message": "Successfully deleted"
    })
})



function isNumeric(str) {
    if (!str) return false; // this handles "", null, undefined, etc.
    return !isNaN(str) && !isNaN(parseFloat(str));
}

router.get('/', async (req, res, next) => {
    // Need to parse query parameters
    let page = req.query.page || "1";
    let size = req.query.size || "20";
    let minLat = req.query.minLat;
    let maxLat = req.query.maxLat;
    let minLng = req.query.minLng;
    let maxLng = req.query.maxLng;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;

    let errors = {};
    if (!isNumeric(page) || page < 1 || page > 10) errors.page = "Page must be greater than or equal to 1 or less than 10";
    if (!isNumeric(size) || size < 1 || size > 20) errors.size = "Size must be greater than or equal to 1 or less than 20 ";
    if (minLat && !isNumeric(minLat)) errors.minLat = "Minimum latitude is invalid";
    if (maxLat && !isNumeric(maxLat)) errors.maxLat = "Maximum latitude is invalid";
    if (minLng && !isNumeric(minLng)) errors.minLng = "Minimum longitude is invalid";
    if (maxLng && !isNumeric(maxLng)) errors.maxLng = "Maximum longitude is invalid";
    if (minPrice != null && (!isNumeric(minPrice) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (maxPrice != null && (!isNumeric(maxPrice) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

    if(Object.keys(errors).length > 0){
        return res.status(400).json({
            "message": "Bad Request",
            "errors": errors
        });
    }

    let offset = (page - 1) * size;

    let options = {
        limit: size,
        offset: offset
    };

    let whereConditions = {};
    if (!isNaN(minLat) && !isNaN(maxLat)) whereConditions.lat = { [Op.between]: [minLat, maxLat] };
    if (!isNaN(minLng) && !isNaN(maxLng)) whereConditions.lng = { [Op.between]: [minLng, maxLng] };
    if (!isNaN(minPrice) && !isNaN(maxPrice)) whereConditions.price = { [Op.between]: [minPrice, maxPrice] };
    if (Object.keys(whereConditions).length > 0) options.where = whereConditions;

    const allSpots = await Spot.findAll(options);

    const spotsWithImagesAndRating = await Promise.all(
        allSpots.map(async (spot) => {
            const images = await SpotImage.findAll({
                where : { spotId: spot.id,
                        preview: true},
            });


            const averageRating = await spot.getAverageRating();
            return {
                    ...spot.get(),
                    avgRating: averageRating,
                    previewImage: images.length > 0 ? images[0].url : null,
                }
    }))
    res.json({Spots: spotsWithImagesAndRating, page: page, size: size})
})




module.exports = router