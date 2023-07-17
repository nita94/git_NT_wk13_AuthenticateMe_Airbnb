const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.get("/search", async (req, res, next) => {

      let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

      if (!page) page = 1;
      if (!size) size = 20;

      let pagination = {};

      if (size >= 1 && page >= 1 && size <= 20 && page <= 10) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
      } else {
            pagination.limit = 20;
            pagination.offset = 0;
      };

      let filters = {};

      if (minLat !== undefined) {
            filters.lat = {[Op.gte]:minLat};
      };
      if (maxLat !== undefined) {
            filters.lat = {[Op.lte]:maxLat};
      };
      if (minLng !== undefined) {
            filters.lng = {[Op.gte]:minLng};
      };
      if (maxLng !== undefined) {
            filters.lng = {[Op.lte]:maxLng};
      };
      if (minPrice !== undefined && minPrice >= 0) {
            filters.price = {[Op.gte]:minPrice};
      };
      if (maxPrice !== undefined && maxPrice >= 0) {
            filters.price = {[Op.lte]:maxPrice};
      };

      const allSpots = await Spot.findAll({
            include: [{model: Review}, {model: SpotImage}],
            ...pagination,
            where: {...filters}
      });

      const spotsArray = [];

      allSpots.forEach(spot => {
            spotsArray.push(spot.toJSON());
      });

      spotsArray.forEach(spot => {

            if (spot.Reviews.length) {

                  let totalStars = 0;
                  let count = 0
                  const starsArray = [];

                  spot.Reviews.forEach(reviews => {
                        count++;
                        starsArray.push(reviews.stars);
                  });

                  const initialValue = 0;
                  totalStars = starsArray.reduce(
                        (accumulator, currentValue) => accumulator + currentValue,
                        initialValue
                  );

                  spot.avgRating = totalStars/count;

            } else spot.avgRating = "There are no current ratings";

            delete spot.Reviews;

            spot.SpotImages.forEach(images => {

                  if(images.preview === true) {
                        spot.previewImage = images.url
                  };
            });

            if(!spot.previewImage) {
                  spot.previewImage = "There is no preview image"
            };

            delete spot.SpotImages;

      });

      return res.json({Spots: spotsArray});
});

router.get("/current", requireAuth, async (req, res, next) => {

      const userSpots = await Spot.findAll({
            where: {
                  ownerId: req.user.id
            },
            include: [{model: Review}, {model: SpotImage}]
      });

      const userArray = [];

      userSpots.forEach(spot => {
            userArray.push(spot.toJSON());
      });

      userArray.forEach(spot => {

            if (spot.Reviews.length) {

                  let totalStars = 0;
                  let count = 0
                  const starsArray = [];

                  spot.Reviews.forEach(reviews => {
                        count++;
                        starsArray.push(reviews.stars);
                  });

                  const initialValue = 0;
                  totalStars = starsArray.reduce(
                        (accumulator, currentValue) => accumulator + currentValue,
                        initialValue
                  );

                  spot.avgRating = totalStars/count;

            } else spot.avgRating = "There are no current ratings";

            delete spot.Reviews;

            spot.SpotImages.forEach(images => {

                  if(images.preview === true) {
                        spot.previewImage = images.url
                  };
            });

            if(!spot.previewImage) {
                  spot.previewImage = "There is no preview image"
            };

            delete spot.SpotImages;

      });

      return res.json({Spots: userArray});
});

router.get("/:spotId/reviews", async (req, res, next) => {

      const curSpotReviews = await Review.findAll({
            where: {
                  spotId: req.params.spotId
            },
            include: [
                  {model: User, attributes: ['id', 'firstName', 'lastName']},
                  {model: ReviewImage, attributes: ['id', 'url']}
            ]
      });

      if (curSpotReviews.length) return res.json({"Reviews":curSpotReviews})
      else {
            res.status(404);
            return res.json({"message": "Spot couldn't be found"});
      };
});

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {

      const sspot = await Spot.findByPk(req.params.spotId);

      if (!sspot) {
            res.status(404);
            return res.json({
                  "message": "Spot couldn't be found"
                });
      }

      if (sspot.ownerId !== req.user.id) {

            const curSpot = await Spot.findByPk(req.params.spotId, {
                  attributes: [],
                  include: [{model: Booking, attributes: ["spotId", "startDate", "endDate"]}]
            });

            const bookingsArray = [];

            const thisSpot = curSpot.toJSON();

            const bookingInfo = Object.values(thisSpot);

            bookingInfo.forEach(bookingss => {

                  bookingss.forEach(bookingsss => {

                        // ==========================================================
                        // Formatting dates
                        // ==========================================================

                        const s = bookingsss.startDate;

                        const sYear = s.getFullYear();
                        const preSMonth = s.getMonth() + 1;
                        const sMonth = preSMonth < 10 ? "0" + preSMonth : preSMonth;
                        const preSDay = s.getDate();
                        const sDay = preSDay < 10 ? "0" + preSDay : preSDay;
                        const sTime = s.toTimeString().substring(0, 8);

                        const formatedStartDate = sYear + "-" + sMonth + "-" + sDay;

                        //===========================

                        const e = bookingsss.endDate;

                        const eYear = e.getFullYear();
                        const preEMonth = e.getMonth() + 1;
                        const eMonth = preEMonth < 10 ? "0" + preEMonth : preEMonth;
                        const preEDay = e.getDate();
                        const eDay = preEDay < 10 ? "0" + preEDay : preEDay;
                        const eTime = e.toTimeString().substring(0, 8);

                        const formatedEndDate = eYear + "-" + eMonth + "-" + eDay;

                        // ==========================================================
                        // ==========================================================

                        bookingsss.startDate = formatedStartDate;
                        bookingsss.endDate = formatedEndDate;
                        bookingsArray.push(bookingsss);
                  });

            });

                  return res.json({"Bookings": bookingsArray});
      };

      if (sspot.ownerId === req.user.id) {

            const curSpot = await Spot.findByPk(req.params.spotId, {
                  attributes: [],
                  include: [
                        {model: Booking,
                              include: [{model: User, attributes: ['id', 'firstName', 'lastName']}]
                        }
                  ]
            });

            const bookingsArray = [];

            const thisSpot = curSpot.toJSON();

            const bookingInfo = thisSpot.Bookings;

            bookingInfo.forEach(bookingss => {

                  // ==========================================================
                  // Formatting dates
                  // ==========================================================

                  const s = bookingss.startDate;

                  const sYear = s.getFullYear();
                  const preSMonth = s.getMonth() + 1;
                  const sMonth = preSMonth < 10 ? "0" + preSMonth : preSMonth;
                  const preSDay = s.getDate();
                  const sDay = preSDay < 10 ? "0" + preSDay : preSDay;
                  const sTime = s.toTimeString().substring(0, 8);

                  const formatedStartDate = sYear + "-" + sMonth + "-" + sDay;

                  //===========================

                  const e = bookingss.endDate;

                  const eYear = e.getFullYear();
                  const preEMonth = e.getMonth() + 1;
                  const eMonth = preEMonth < 10 ? "0" + preEMonth : preEMonth;
                  const preEDay = e.getDate();
                  const eDay = preEDay < 10 ? "0" + preEDay : preEDay;
                  const eTime = e.toTimeString().substring(0, 8);

                  const formatedEndDate = eYear + "-" + eMonth + "-" + eDay;

                  //===========================

                  const c = bookingss.createdAt;

                  const cYear = c.getFullYear();
                  const preCMonth = c.getMonth() + 1;
                  const cMonth = preCMonth < 10 ? "0" + preCMonth : preCMonth;
                  const preCDay = c.getDate();
                  const cDay = preCDay < 10 ? "0" + preCDay : preCDay;
                  const cTime = c.toTimeString().substring(0, 8);

                  const formatedCreatedDate = cYear + "-" + cMonth + "-" + cDay + " " + cTime;

                  //===========================

                  const u = bookingss.updatedAt;

                  const uYear = u.getFullYear();
                  const preUMonth = u.getMonth() + 1;
                  const uMonth = preUMonth < 10 ? "0" + preUMonth : preUMonth;
                  const preUDay = u.getDate();
                  const uDay = preUDay < 10 ? "0" + preUDay : preUDay;
                  const uTime = u.toTimeString().substring(0, 8);

                  const formatedUpdatedDate = uYear + "-" + uMonth + "-" + uDay + " " + uTime;

                  // ==========================================================
                  // ==========================================================

                  const bookingObj = {
                        User: bookingss.User,
                        id: bookingss.id,
                        spotId: bookingss.spotId,
                        userId: bookingss.userId,
                        startDate: formatedStartDate,
                        endDate: formatedEndDate,
                        createdAt: formatedCreatedDate,
                        updatedAt: formatedUpdatedDate
                  };

                  bookingsArray.push(bookingObj);

            });

                  return res.json({"Bookings": bookingsArray});
      }

});

router.get("/:spotId", async (req, res, next) => {

      const idSpot = await Spot.findByPk (req.params.spotId, {
            include: [
                  {model: Review},
                  {model: SpotImage, attributes: ['id', 'url', 'preview']},
                  {model: User, as: "Owner", attributes: ['id', 'firstName', 'lastName']}
            ]
      });

      if(!idSpot){
            res.status(404);
            return res.json({"message": "Spot couldn't be found"});
      };

      const parsedIdSpot = idSpot.toJSON();

      if (parsedIdSpot.Reviews.length) {

            let totalStars = 0;
            let reviewCount = 0;
            const starsArray = [];

            parsedIdSpot.Reviews.forEach(reviews => {
                  reviewCount++;
                  starsArray.push(reviews.stars);
            });

            const initialValue = 0;
            totalStars = starsArray.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  initialValue
            );

            parsedIdSpot.numReviews = reviewCount;
            parsedIdSpot.avgStarRating = totalStars/reviewCount;

      } else {
            parsedIdSpot.numReviews = 0;
            parsedIdSpot.avgStarRating = "There are no current ratings";
      }

      const { id, ownerId, address, city, state, country,lat, lng, name, description, price, createdAt, updatedAt, SpotImages, Owner, numReviews, avgStarRating } = parsedIdSpot;


      // ==========================================================
      // Formatting dates
      // ==========================================================

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

      const finalIdSpot = {id, ownerId, address, city, state, country,lat, lng, name, description, price, createdAt: formatedCreatedDate, updatedAt: formatedUpdatedDate, numReviews, avgStarRating, SpotImages, Owner};

      return res.json(finalIdSpot);
});

router.get("/", async (req, res, next) => {

      let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

      if (!page) page = 1;
      if (!size) size = 20;

      let pagination = {};

      if (size >= 1 && page >= 1 && size <= 20 && page <= 10) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
      } else {
            pagination.limit = 20;
            pagination.offset = 0;
      };

      let filters = {};

      if (minLat !== undefined) {
            filters.lat = {[Op.gte]:minLat};
      };
      if (maxLat !== undefined) {
            filters.lat = {[Op.lte]:maxLat};
      };
      if (minLng !== undefined) {
            filters.lng = {[Op.gte]:minLng};
      };
      if (maxLng !== undefined) {
            filters.lng = {[Op.lte]:maxLng};
      };
      if (minPrice !== undefined && minPrice >= 0) {
            filters.price = {[Op.gte]:minPrice};
      };
      if (maxPrice !== undefined && maxPrice >= 0) {
            filters.price = {[Op.lte]:maxPrice};
      };

      const allSpots = await Spot.findAll({
            include: [{model: Review}, {model: SpotImage}],
            ...pagination,
            where: {...filters}
      });

      const spotsArray = [];

      allSpots.forEach(spot => {
            spotsArray.push(spot.toJSON());
      });

      spotsArray.forEach(spot => {

            if (spot.Reviews.length) {

                  let totalStars = 0;
                  let count = 0
                  const starsArray = [];

                  spot.Reviews.forEach(reviews => {
                        count++;
                        starsArray.push(reviews.stars);
                  });

                  const initialValue = 0;
                  totalStars = starsArray.reduce(
                        (accumulator, currentValue) => accumulator + currentValue,
                        initialValue
                  );

                  spot.avgRating = totalStars/count;

            } else spot.avgRating = "There are no current ratings";

            delete spot.Reviews;

            spot.SpotImages.forEach(images => {

                  if(images.preview === true) {
                        spot.previewImage = images.url
                  };
            });

            if(!spot.previewImage) {
                  spot.previewImage = "There is no preview image"
            };

            delete spot.SpotImages;

      });

      return res.json({Spots: spotsArray});
});

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {

      function datesBetween(startD, endD) {
            const currentD = new Date(startD.getTime());
            const dates = [];
            while (currentD <= endD) {
              dates.push(new Date(currentD));
              currentD.setDate(currentD.getDate() + 1);
            };
            return dates;
      };

      let { startDate, endDate } = req.body;

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

      const curSpot = await Spot.findByPk(req.params.spotId);

      if (!curSpot) {
            res.status(404);
            return res.json({
                  "message": "Spot couldn't be found"
                });
      };

      if (curSpot.ownerId === req.user.id) {
            res.status(403);
            return res.json({"message": "Forbidden"});
      };

      //=================================================
      // Find all dates that are booked for this spot
      //=================================================

      const allBookings = await Booking.findAll({
            where: {
                  spotId: curSpot.id
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

      const newBooking = await Booking.create({
            spotId: curSpot.id,
            userId: req.user.id,
            startDate,
            endDate
      });

      const { id, spotId, userId, createdAt, updatedAt } = newBooking;

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

      const confirmedBooking = {
            id,
            spotId,
            userId,
            startDate: formatedStartDate,
            endDate: formatedEndDate,
            createdAt: formatedCreatedDate,
            updatedAt: formatedUpdatedDate
      };

      return res.json(confirmedBooking);

});

router.post("/:spotId/images", requireAuth, async (req, res, next) => {

      const { url, preview } = req.body;

      const curSpot = await Spot.findByPk(req.params.spotId);

      if (curSpot && curSpot.ownerId === req.user.id) {

            const newSpotImage = await SpotImage.create({
                  url,
                  preview,
                  spotId: curSpot.id
            });

            const finalSpotImage = await SpotImage.findByPk(newSpotImage.id, {
                  attributes: ['id', 'url', 'preview']
            });

            return res.json(finalSpotImage);

      } else if (curSpot && curSpot.ownerId !== req.user.id) {
            res.status(403);
            return res.json({
                  "message": "Forbidden"
                });
      } else {
            res.status(404);
            return res.json({"message": "Spot couldn't be found"});
      }
});

router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {

      const curSpot = await Spot.findByPk(req.params.spotId, {
            include: Review
      });

      if (!curSpot) {
            res.status(404);
            return res.json({"message": "Spot couldn't be found"});
      }

      const curReviewsArray = [];

      curSpot.Reviews.forEach(reviews => {
            const {userId} = reviews.dataValues;
            curReviewsArray.push(userId);
      })

      if (curReviewsArray.includes(req.user.id)){
            res.status(500);
            return res.json({"message": "User already has a review for this spot"})
      }

      if (curSpot){
            const { review, stars } = req.body;

            const newReview = await Review.create({
                  userId: req.user.id,
                  spotId: req.params.spotId,
                  review,
                  stars,
            });

            res.status(201);
            return res.json(newReview);

      };
});

router.post("/", requireAuth, async (req, res, next) => {

      const { address, city, state, country, lat, lng, name, description, price } = req.body;

      const newSpot = await Spot.create({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            ownerId: req.user.id
      });

            res.status(201);
            return res.json(newSpot);

});

router.put("/:spotId", requireAuth, async (req, res, next) => {

      const { address, city, state, country, lat, lng, name, description, price } = req.body;

      const curSpot = await Spot.findByPk(req.params.spotId)

      if (curSpot && curSpot.ownerId === req.user.id) {

            const updatedSpot = await curSpot.update({
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

            return res.json(updatedSpot);

      } else if (curSpot && curSpot.ownerId !== req.user.id) {
            res.status(403);
            return res.json({
                  "message": "Forbidden"
                });
      } else {
            res.status(404);
            return res.json({"message": "Spot couldn't be found"});
      }

});

router.delete("/:spotId", requireAuth, async (req, res, next) => {

      const curSpot = await Spot.findByPk(req.params.spotId);

      if (curSpot && curSpot.ownerId === req.user.id) {
            curSpot.destroy();
            return res.json({"message": "Successfully deleted"});

      } else if (curSpot && curSpot.ownerId !== req.user.id) {
            res.status(403);
            return res.json({
                  "message": "Forbidden"
                });

      } else {
            res.status(404);
            return res.json({"message": "Spot couldn't be found"});
      }
});

module.exports = router;