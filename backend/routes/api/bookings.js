const express = require('express');
const { Op, Sequelize } = require('sequelize');
const { Booking, Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

//Get all current User's bookings
router.get('/current', requireAuth, async (req, res) => {
    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        }
    });

    // console.log(bookings)

    let arr = [];

    for (let booking of bookings) {
        const spot = await Spot.findOne({
            where: {
                id: booking.spotId
            },
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            }
        });

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

        const newSpot = spot.toJSON()

        newSpot.previewImage = imageVal;

        const result = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: newSpot,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        arr.push(result)
    }

    res.json({
        Bookings: arr
    })
});

//Edit a booking
router.put('/:id', requireAuth, async(req, res) => {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        })
    };

    if (booking.userId !== req.user.id) {
        res.status(404);
        return res.json({
            message: "Booking must belong to current user"
        })
    };

    const today = new Date()

    if (booking.endDate < today) {
        res.status(403);
        return res.json({
            message: "Past bookings cannot be modified"
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

    const updatedBooking = await booking.update({
        startDate,
        endDate
    });

    res.json(updatedBooking)
});

//Delete a booking
router.delete('/:id', requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
        res.status(404);
        return res.json({
            message: "Booking couldn't be found"
        })
    };

    if (booking.userId !== req.user.id) {
        res.status(403);
        return res.json({
            message: "Booking must belong to current user"
        })
    };

    const today = new Date();

    if (booking.startDate <= today) {
        res.status(403);
        return res.json({
            message: "Bookings that have been started can't be deleted"
        })
    };

    booking.destroy();

    res.json({
        message: "Successfully deleted"
    })
});

module.exports = router;