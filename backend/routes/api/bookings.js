const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.get("/current", requireAuth, async (req, res, next) => {

      const userBookings = await Booking.findAll({
            where: {
                  userId: req.user.id
            },
            include: [
                  {model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'], include: SpotImage},
            ]
      });

      const bookingsArray = [];
      const confirmedBooking = [];

      userBookings.forEach(booking => {
            bookingsArray.push(booking.toJSON());
      });

      bookingsArray.forEach(booking => {

            booking.Spot.SpotImages.forEach(image => {

                  if(image.preview === true) {
                        booking.Spot.previewImage = image.url
                  };
            });

            if(!booking.Spot.previewImage) {
                  booking.Spot.previewImage = "There is no preview image"
            };

            delete booking.Spot.SpotImages;

            // ==========================================================
            // Formatting dates
            // ==========================================================

            const s = booking.startDate;

            const sYear = s.getFullYear();
            const preSMonth = s.getMonth() + 1;
            const sMonth = preSMonth < 10 ? "0" + preSMonth : preSMonth;
            const preSDay = s.getDate();
            const sDay = preSDay < 10 ? "0" + preSDay : preSDay;
            const sTime = s.toTimeString().substring(0, 8);

            const formatedStartDate = sYear + "-" + sMonth + "-" + sDay;

            //===========================

            const e = booking.endDate;

            const eYear = e.getFullYear();
            const preEMonth = e.getMonth() + 1;
            const eMonth = preEMonth < 10 ? "0" + preEMonth : preEMonth;
            const preEDay = e.getDate();
            const eDay = preEDay < 10 ? "0" + preEDay : preEDay;
            const eTime = e.toTimeString().substring(0, 8);

            const formatedEndDate = eYear + "-" + eMonth + "-" + eDay;

            //===========================

            const c = booking.createdAt;

            const cYear = c.getFullYear();
            const preCMonth = c.getMonth() + 1;
            const cMonth = preCMonth < 10 ? "0" + preCMonth : preCMonth;
            const preCDay = c.getDate();
            const cDay = preCDay < 10 ? "0" + preCDay : preCDay;
            const cTime = c.toTimeString().substring(0, 8);

            const formatedCreatedDate = cYear + "-" + cMonth + "-" + cDay + " " + cTime;

            //===========================

            const u = booking.updatedAt;

            const uYear = u.getFullYear();
            const preUMonth = u.getMonth() + 1;
            const uMonth = preUMonth < 10 ? "0" + preUMonth : preUMonth;
            const preUDay = u.getDate();
            const uDay = preUDay < 10 ? "0" + preUDay : preUDay;
            const uTime = u.toTimeString().substring(0, 8);

            const formatedUpdatedDate = uYear + "-" + uMonth + "-" + uDay + " " + uTime;

            // ==========================================================
            // ==========================================================

            booking.startDate = formatedStartDate;
            booking.endDate = formatedEndDate;
            booking.createdAt = formatedCreatedDate;
            booking.updatedAt = formatedUpdatedDate;

            const { id, spotId, userId, startDate, endDate, createdAt, updatedAt, Spot } = booking;

            const confirmed = {
                  id,
                  spotId,
                  Spot,
                  userId,
                  startDate,
                  endDate,
                  createdAt,
                  updatedAt
            };

            confirmedBooking.push(confirmed);
       });

      return res.json({"Bookings": confirmedBooking});

});

router.put("/:bookingId", requireAuth, async (req, res, next) => {

      const { startDate, endDate } = req.body;

      //=================================
      // Dropping leading zero from date

      const startDateArray = startDate.split('-');

      if (startDateArray[2][0] === '0') {
            startDate = startDateArray[0] + "-" + startDateArray[1] + "-" + startDateArray[2][1];
      };

      const startEndArray = endDate.split('-');

      if (startEndArray[2][0] === '0') {
            endDate = startEndArray[0] + "-" + startEndArray[1] + "-" + startEndArray[2][1];
      };
      //=================================

      function datesBetween(startD, endD) {
            const currentD = new Date(startD.getTime());
            const dates = [];
            while (currentD <= endD) {
              dates.push(new Date(currentD));
              currentD.setDate(currentD.getDate() + 1);
            };
            return dates;
      };

      const curBooking = await Booking.findByPk(req.params.bookingId);

      if (!curBooking) {
            res.status(404);
            return res.json({
                  "message": "Booking couldn't be found"
            });
      };

      if (curBooking.userId !== req.user.id) {
            res.status(403);
            return res.json({
                  "message": "Forbidden"
                });
      };

      const curDate = new Date();

      if (curBooking.endDate.getTime() < curDate.getTime()) {
            res.status(403);
            return res.json({
                  "message": "Past bookings can't be modified"
                });
      };

      const allBookings = await Booking.findAll({
            where: {
                  spotId: curBooking.spotId
            }
      });

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

      //=================================================
      // Handling date conflicts
      //=================================================

      const requestStart = new Date(startDate);
      const requestEnd = new Date(endDate);
      const requestedDatesArray = datesBetween(requestStart, requestEnd);

      if (bookedDatesArray.includes(requestStart.getTime())) {
            res.status(403);
            return res.json({
                  "message": "Sorry, this spot is already booked for the specified dates",
                  "errors": {
                    "startDate": "Start date conflicts with an existing booking"
                  }
            });
      };

      if (bookedDatesArray.includes(requestEnd.getTime())) {
            res.status(403);
            return res.json({
                  "message": "Sorry, this spot is already booked for the specified dates",
                  "errors": {
                        "endDate": "End date conflicts with an existing booking"
                  }
            });
      };

      for (let i = 0; i < requestedDatesArray.length; i++) {
            let thisDate = requestedDatesArray[i];
            if (bookedDatesArray.includes(thisDate.getTime())) {
                  res.status(403);
                  return res.json({"message": "Sorry, this spot is already booked in the middle of your requested stay"})
                  break;
            };
      };

      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      if (newStart.getTime() >= newEnd.getTime()) {
            res.status(400);
            return res.json({
                  "message": "Bad Request",
                  "errors": {
                    "endDate": "endDate cannot be on or before startDate"
                  }
            })
      };

      await curBooking.update({
            startDate,
            endDate
      });

      const { id, spotId, userId, createdAt, updatedAt } = curBooking;

      // ==========================================================
      // Formatting dates
      // ==========================================================

      const s = new Date (startDate);

      const sYear = s.getFullYear();
      const preSMonth = s.getMonth() + 1;
      const sMonth = preSMonth < 10 ? "0" + preSMonth : preSMonth;
      const preSDay = s.getDate();
      const sDay = preSDay < 10 ? "0" + preSDay : preSDay;
      const sTime = s.toTimeString().substring(0, 8);

      const formatedStartDate = sYear + "-" + sMonth + "-" + sDay;

      //===========================

      const e = new Date (endDate);

      const eYear = e.getFullYear();
      const preEMonth = e.getMonth() + 1;
      const eMonth = preEMonth < 10 ? "0" + preEMonth : preEMonth;
      const preEDay = e.getDate();
      const eDay = preEDay < 10 ? "0" + preEDay : preEDay;
      const eTime = e.toTimeString().substring(0, 8);

      const formatedEndDate = eYear + "-" + eMonth + "-" + eDay;

      //===========================

      const c = new Date (createdAt);

      const cYear = c.getFullYear();
      const preCMonth = c.getMonth() + 1;
      const cMonth = preCMonth < 10 ? "0" + preCMonth : preCMonth;
      const preCDay = c.getDate();
      const cDay = preCDay < 10 ? "0" + preCDay : preCDay;
      const cTime = c.toTimeString().substring(0, 8);

      const formatedCreatedDate = cYear + "-" + cMonth + "-" + cDay + " " + cTime;

      //===========================

      const u = new Date (updatedAt);

      const uYear = u.getFullYear();
      const preUMonth = u.getMonth() + 1;
      const uMonth = preUMonth < 10 ? "0" + preUMonth : preUMonth;
      const preUDay = u.getDate();
      const uDay = preUDay < 10 ? "0" + preUDay : preUDay;
      const uTime = u.toTimeString().substring(0, 8);

      const formatedUpdatedDate = uYear + "-" + uMonth + "-" + uDay + " " + uTime;

      // ==========================================================
      // ==========================================================

      const updatedBooking = {
            id,
            spotId,
            userId,
            startDate: formatedStartDate,
            endDate: formatedEndDate,
            createdAt: formatedCreatedDate,
            updatedAt: formatedUpdatedDate
      };

      return res.json(updatedBooking);
});

router.delete("/:bookingId", requireAuth, async (req, res, next) => {

      const curBooking = await Booking.findByPk(req.params.bookingId);

      if (!curBooking) {
            res.status(404);
            return res.json({
                  "message": "Booking couldn't be found"
            });
      };

      const curSpot = await Spot.findOne({
            where: {
                  id: curBooking.spotId
            }
      });

      if (req.user.id !== curBooking.userId && req.user.id !== curSpot.ownerId) {
            res.status(403);
            return res.json({
                  "message": "Forbidden"
            });
      };

      const curDate = new Date();

      if (curDate.getTime() >= curBooking.startDate.getTime()) {
            res.status(403);
            return res.json({
                  "message": "Bookings that have been started can't be deleted"
            });
      };

      curBooking.destroy();

      return res.json({"message": "Successfully deleted"});
});




module.exports = router;