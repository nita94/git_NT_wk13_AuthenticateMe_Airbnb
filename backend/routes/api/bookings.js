const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { handleValidationErrors } = require('../../utils/validation.js');
const { getCurrDate } = require('../../utils/currDate.js')
const router = express.Router();

const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models')

// <---------------------------- GET ALL CURRENT USER BOOKINGS ---------------------------->
router.get('/current', async (req, res) => {
    if(req.user) {
        const userBookings = await Booking.findAll({
            where: {
                userId: req.user.id
            }
        })

        for(let booking of userBookings) {
            const spot = await Spot.scope({ method: ['getCurrentUserReviews', booking.spotId] }).findOne({
                where: {
                    id: booking.spotId
                }
            })


            const image = await SpotImage.findOne({
                where: {
                    spotId: spot.id
                }
            })
            if(image) {
                const imageUrl = image.dataValues.url
                spot.dataValues.previewImage = imageUrl
            } else {
                spot.dataValues.previewImage = null
            }
            booking.dataValues.Spot = spot
        }

        res.json({ Bookings: userBookings })
    } else {
        res.status(401)
        res.json({ message: "Authentication required" })
    }
})

// <---------------------------- EDIT A BOOKING ---------------------------->
router.put('/:id', async (req, res) => {
    if(req.user) {
        const booking = await Booking.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!booking) {
            res.status(404)
            return res.json({ message: "Booking couldn't be found" })
        }



        if(booking && booking.userId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        if(booking && booking.userId === req.user.id) {
            const { startDate, endDate } = req.body

            const spot = await Spot.findOne({
                where: {
                    id: booking.spotId
                }
            })

         // check booking dates of spot
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
        const currStart = booking.startDate.split("-")
        const currEnd = booking.endDate.split("-")
        const validCurrDate = getCurrDate()


        const newBookStartYear = parseInt(c1[0])
        const newBookStartMonth = parseInt(c1[1]-1)
        const newBookStartDay = parseInt(c1[2])

        const newBookEndYear = parseInt(c2[0])
        const newBookEndMonth = parseInt(c2[1]-1)
        const newBookEndDay = parseInt(c2[2])

        const currentStartYear = parseInt(currStart[0])
        const currentStartMonth = parseInt(currStart[1]-1)
        const currentStartDay = parseInt(currStart[2])

        const currentEndYear = parseInt(currEnd[0])
        const currentEndMonth = parseInt(currEnd[1]-1)
        const currentEndDay = parseInt(currEnd[2])

        const newBookStartDateObj = new Date(newBookStartYear, newBookStartMonth, newBookStartDay)
        const newBookEndDateObj = new Date(newBookEndYear, newBookEndMonth, newBookEndDay)
        const currStartDate = new Date(currentStartYear, currentStartMonth, currentStartDay)
        const currEndDate = new Date(currentEndYear, currentEndMonth, currentEndDay)
        const check = new Date(validCurrDate[2], validCurrDate[0]-1, validCurrDate[1]);

        if(check.getTime() > currStartDate.getTime()) {
            res.status(403)
            return res.json({ message: "Past bookings can't be modified" })
        }


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
        // checking for invalid end date
        if(newBookStartDateObj >= newBookEndDateObj) {
            res.status(400)
            return res.json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot come before startDate"
                }
            })
        }

            // updating booking if none of the above errors apply
            booking.set({
                startDate: startDate || booking.startDate,
                endDate: endDate || booking.endDate
            })

            await booking.save()
            return res.json(booking)
        }




    } else {
        res.status(401)
        return res.json({ message: "Authentication required" })
    }
})

// <---------------------------- DELETE A BOOKING ---------------------------->
router.delete('/:id', async (req, res) => {
    if(req.user) {
        const booking = await Booking.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!booking) {
            res.status(404)
            return res.json({ message: "Booking couldn't be found" })
        }

        const spot = await Spot.findOne({
            where: {
                id: booking.spotId
            }
        })

        if(booking && booking.userId !== req.user.id && spot.ownerId !== req.user.id) {
            res.status(403)
            return res.json({ message: "Forbidden" })
        }

        if(booking && (booking.userId === req.user.id || spot.ownerId === req.user.id)) {
            // const startDate = booking.startDate
            // const endDate = booking.endDate

            const currStart = booking.startDate.split("-")
            const currEnd = booking.endDate.split("-")
            const validCurrDate = getCurrDate()

            const currentStartYear = parseInt(currStart[0])
            const currentStartMonth = parseInt(currStart[1]-1)
            const currentStartDay = parseInt(currStart[2])

            const currentEndYear = parseInt(currEnd[0])
            const currentEndMonth = parseInt(currEnd[1]-1)
            const currentEndDay = parseInt(currEnd[2])

            const currStartDate = new Date(currentStartYear, currentStartMonth, currentStartDay)
            const currEndDate = new Date(currentEndYear, currentEndMonth, currentEndDay)
            const check = new Date(validCurrDate[2], validCurrDate[0]-1, validCurrDate[1]);

            // const validCurrDate = getCurrDate()
            // const startArr = startDate.split('-')
            // const endArr = endDate.split('-')



            // const from = new Date(startArr[2], parseInt(startArr[1])-1, startArr[0]);  // -1 because months are from 0 to 11
            // const to   = new Date(endArr[2], parseInt(endArr[1])-1, endArr[0]);
            // const check = new Date(validCurrDate[1], parseInt(validCurrDate[0])-1, validCurrDate[2]);

            // if((check >= from && check <= to) || (check > to)) {
            //     res.status(403)
            //     return res.json({ message: "Bookings that have been started can't be deleted" })
            // }
            if(currStartDate.getTime() <= check.getTime()) {
                res.status(403)
                return res.json({ message: "Bookings that have been started can't be deleted" })
            }

            await booking.destroy()
            return res.json({ message: "Successfully deleted" })

        }
    } else {
        res.status(401)
        return res.json({ message: "Authorization required" })
    }
})

module.exports = router;