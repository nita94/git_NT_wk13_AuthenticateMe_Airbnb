// Imports
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Router
const router = express.Router();

// Helper function for date formatting
const formatDate = date => {
    const year = date.getFullYear();
    const preMonth = date.getMonth() + 1;
    const month = preMonth < 10 ? "0" + preMonth : preMonth;
    const preDay = date.getDate();
    const day = preDay < 10 ? "0" + preDay : preDay;
    const time = date.toTimeString().substring(0, 8);
  
    return `${year}-${month}-${day} ${time}`;
};

// GET - Current bookings
router.get("/current", requireAuth, async (req, res, next) => {
    const userBookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [{ model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'], include: SpotImage }],
    });
  
    const confirmedBooking = userBookings.map(booking => {
        const bookingJson = booking.toJSON();
  
        bookingJson.Spot.SpotImages.forEach(image => {
            if(image.preview) {
                bookingJson.Spot.previewImage = image.url;
            }
        });
  
        if(!bookingJson.Spot.previewImage) {
            bookingJson.Spot.previewImage = "There is no preview image";
        }
  
        delete bookingJson.Spot.SpotImages;
  
        bookingJson.startDate = formatDate(bookingJson.startDate);
        bookingJson.endDate = formatDate(bookingJson.endDate);
        bookingJson.createdAt = formatDate(bookingJson.createdAt);
        bookingJson.updatedAt = formatDate(bookingJson.updatedAt);
  
        const { id, spotId, userId, startDate, endDate, createdAt, updatedAt, Spot } = bookingJson;
  
        return { id, spotId, Spot, userId, startDate, endDate, createdAt, updatedAt };
    });
  
    res.json({ "Bookings": confirmedBooking });
});

// PUT - Update booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
    let { startDate, endDate } = req.body;

    const dropLeadingZero = dateStr => {
        const dateArray = dateStr.split('-');
        if (dateArray[2][0] === '0') {
            return `${dateArray[0]}-${dateArray[1]}-${dateArray[2][1]}`;
        }
        return dateStr;
    };
  
    startDate = dropLeadingZero(startDate);
    endDate = dropLeadingZero(endDate);
  
    const datesBetween = (startD, endD) => {
        const currentD = new Date(startD.getTime());
        const dates = [];
        while (currentD <= endD) {
            dates.push(new Date(currentD));
            currentD.setDate(currentD.getDate() + 1);
        }
        return dates;
    };
  
    const curBooking = await Booking.findByPk(req.params.bookingId);
  
    if (!curBooking) {
        res.status(404);
        return res.json({ "message": "Booking couldn't be found" });
    }
  
    if (curBooking.userId !== req.user.id) {
        res.status(403);
        return res.json({ "message": "Error, incorrect user" });
    }
  
    const curDate = new Date();
  
    if (curBooking.endDate.getTime() < curDate.getTime()) {
        res.status(403);
        return res.json({ "message": "Past bookings can't be modified" });
    }
  
    const allBookings = await Booking.findAll({ where: { spotId: curBooking.spotId } });
  
    const bookedDatesArray = [];
  
    allBookings.forEach(bookingss => {
        const fullBookingInfo = bookingss.toJSON();
        const sstart = fullBookingInfo.startDate;
        const eend = fullBookingInfo.endDate;
  
        const allDates = datesBetween(sstart, eend);
  
        allDates.forEach(datess => {
            bookedDatesArray.push(datess.getTime());
        });
    });
  
    const requestStart = new Date(startDate);
    const requestEnd = new Date(endDate);
    const requestedDatesArray = datesBetween(requestStart, requestEnd);
  
    if (bookedDatesArray.includes(requestStart.getTime())) {
        res.status(403);
        return res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": { "startDate": "Start date conflicts with an existing booking" }
        });
    }
  
    if (bookedDatesArray.includes(requestEnd.getTime())) {
        res.status(403);
        return res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": { "endDate": "End date conflicts with an existing booking" }
        });
    }
  
    for (let i = 0; i < requestedDatesArray.length; i++) {
        let thisDate = requestedDatesArray[i];
        if (bookedDatesArray.includes(thisDate.getTime())) {
            res.status(403);
            return res.json({"message": "Sorry, this spot is already booked in the middle of your requested stay"});
        }
    }
  
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
  
    if (newStart.getTime() >= newEnd.getTime()) {
        res.status(400);
        return res.json({
            "message": "Bad Request",
            "errors": { "endDate": "endDate cannot be on or before startDate" }
        });
    }
  
    await curBooking.update({ startDate, endDate });
  
    const { id, spotId, userId, createdAt, updatedAt } = curBooking;
  
    startDate = formatDate(new Date(startDate));
    endDate = formatDate(new Date(endDate));
    createdAt = formatDate(new Date(createdAt));
    updatedAt = formatDate(new Date(updatedAt));
  
    const updatedBooking = { id, spotId, userId, startDate, endDate, createdAt, updatedAt };
  
    return res.json(updatedBooking);
});

// DELETE - Delete booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
    const curBooking = await Booking.findByPk(req.params.bookingId);
  
    if (!curBooking) {
        res.status(404);
        return res.json({ "message": "Booking couldn't be found" });
    }
  
    const curSpot = await Spot.findOne({ where: { id: curBooking.spotId } });
  
    if (req.user.id !== curBooking.userId && req.user.id !== curSpot.ownerId) {
        res.status(403);
        return res.json({ "message": "Forbidden" });
    }
  
    const curDate = new Date();
  
    if (curDate.getTime() >= curBooking.startDate.getTime()) {
        res.status(403);
        return res.json({ "message": "Bookings that have been started can't be deleted" });
    }
  
    curBooking.destroy();
  
    return res.json({ "message": "Successfully deleted" });
});

module.exports = router;
