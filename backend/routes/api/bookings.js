const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Function to format date
function formatDate(d) {
  const year = d.getFullYear();
  const preMonth = d.getMonth() + 1;
  const month = preMonth < 10 ? "0" + preMonth : preMonth;
  const preDay = d.getDate();
  const day = preDay < 10 ? "0" + preDay : preDay;
  const time = d.toTimeString().substring(0, 8);

  return `${year}-${month}-${day} ${time}`;
}

// Function to handle booking
function handleBooking(booking) {
  booking.Spot.SpotImages.forEach(image => {
    if(image.preview === true) {
      booking.Spot.previewImage = image.url
    };
  });

  if(!booking.Spot.previewImage) {
    booking.Spot.previewImage = "There is no preview image"
  };

  delete booking.Spot.SpotImages;

  booking.startDate = formatDate(new Date(booking.startDate));
  booking.endDate = formatDate(new Date(booking.endDate));
  booking.createdAt = formatDate(new Date(booking.createdAt));
  booking.updatedAt = formatDate(new Date(booking.updatedAt));

  const { id, spotId, userId, startDate, endDate, createdAt, updatedAt, Spot } = booking;

  return {
    id,
    spotId,
    Spot,
    userId,
    startDate,
    endDate,
    createdAt,
    updatedAt
  };
}

router.get("/current", requireAuth, async (req, res, next) => {
  const userBookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      {model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'], include: SpotImage},
    ]
  });

  const confirmedBooking = userBookings.map(booking => handleBooking(booking.toJSON()));

  return res.json({"Bookings": confirmedBooking});
});

// Function to handle booking update
async function handleBookingUpdate(req, res, curBooking, startDate, endDate) {
      // Other codes...
  
      const updatedBooking = {
          id: curBooking.id,
          spotId: curBooking.spotId,
          userId: curBooking.userId,
          startDate: formatDate(new Date(startDate)),
          endDate: formatDate(new Date(endDate)),
          createdAt: formatDate(new Date(curBooking.createdAt)),
          updatedAt: formatDate(new Date(curBooking.updatedAt))
      };
  
      return res.json(updatedBooking);
  }
  
  router.put("/:bookingId", requireAuth, async (req, res, next) => {
      let { startDate, endDate } = req.body;
  
      const curBooking = await Booking.findByPk(req.params.bookingId);
      // Other codes...
  
      return handleBookingUpdate(req, res, curBooking, startDate, endDate);
  });
  
  // Function to handle booking deletion
  async function handleBookingDeletion(req, res, curBooking) {
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
  }
  
  router.delete("/:bookingId", requireAuth, async (req, res, next) => {
      const curBooking = await Booking.findByPk(req.params.bookingId);
  
      if (!curBooking) {
          res.status(404);
          return res.json({
              "message": "Booking couldn't be found"
          });
      };
  
      return handleBookingDeletion(req, res, curBooking);
  });
      