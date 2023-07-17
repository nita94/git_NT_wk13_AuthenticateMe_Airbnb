const express = require('express')
const { check } = require('express-validator');
const{requireAuth} = require('../../utils/auth')
const { Op } = require('sequelize')
const { handleValidationErrors } = require('../../utils/validation');

const { User, Spot, SpotImage, Review, ReviewImage, sequelize, Booking } = require('../../db/models');
const router = express.Router();



router.get('/current', requireAuth, async (req, res, next)=> {
    const currentUser = req.user.id;

    const allBookings = await Booking.findAll({
        where: {userId: currentUser},
        include: [
            {
                model: Spot,
            }
        ]
    })

    const bookingsWithSpotPreview = await Promise.all(
        allBookings.map(async (booking) => {
            const spot = booking.Spot;
            const images = await SpotImage.findAll({
                where : { spotId: spot.id },
            });

            return {
                ...booking.get(),
                Spot: {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    description: spot.description,
                    price: spot.price,
                    previewImage: images.length > 0 ? images[0].url : null,
                }
            };
        })
    );

    res.json({ Bookings: bookingsWithSpotPreview });
})



router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const currentUser = req.user.id;
    const editedBooking = await Booking.findByPk(bookingId);


    if(!editedBooking){
        res.status(404).json({
            "message": "Booking couldn't be found"
        })
    }
    const owner = editedBooking.userId
    if(currentUser !== owner){
        res.status(403).json({
            "message": "Current user is prohibited from accessing the selected data"
        })
    }
    const { startDate, endDate } = req.body;
    let errors = {}


    const newStartDate = startDate !== undefined ? startDate : editedBooking.startDate;
    const newEndDate = endDate !== undefined ? endDate : editedBooking.endDate;


    if(new Date(newStartDate) >= new Date(newEndDate)){
        errors.date = "Start date cannot be on or after end date";
    } else {

        const conflictingBooking = await Booking.findOne({
            where: {
                spotId: editedBooking.spotId,
                id: { [Op.ne]: bookingId }, // Ignore current booking (ne is not equal)
                [Op.or]: [
                    {
                        startDate: {
                            [Op.between]: [newStartDate, newEndDate]
                        }
                    },
                    {
                        endDate: {
                            [Op.between]: [newStartDate, newEndDate]
                        }
                    }
                ]
            }
        });

        if(conflictingBooking){
            errors.date = "New booking dates conflict with an existing booking";
        } else {
            editedBooking.startDate = newStartDate;
            editedBooking.endDate = newEndDate;
        }
    }
    if(Object.keys(errors).length > 0){
        return res.status(400).json({
            "message": "Bad Request",
            "errors": errors
        });
    }

    const finalBooking = await editedBooking.save();
    return res.json(finalBooking)
})


router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId, {
        include: [
            {
                model: User
            },
            {
                model: Spot
            }
        ]
    });
    if(!booking){
        return res.status(404).json({
            "message": "Booking couldn't be found"
        })
    }
    const currentUser = req.user.id;
    if(booking.userId !== currentUser && booking.Spot.ownerId !== currentUser){
        return res.status(403).json({
            "message": "Current user is prohibited from accessing the selected data"
        })
    }

    const today = Date.now();
    if(booking.startDate < today){
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted"
        })
    }
    await booking.destroy();
    return res.json({
        "message": "Successfully deleted"
    })
})








module.exports = router