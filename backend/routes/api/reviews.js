const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.get("/current", requireAuth, async (req, res, next) => {

      const curUserReviews = await Review.findAll({
            where: {
                  userId: req.user.id
            },
            include: [
                  {model: User, attributes: ['id', 'firstName', 'lastName']},
                  {
                        model: Spot,
                        attributes:['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                        include: [{model: SpotImage}]
                  },
                  {model: ReviewImage}
            ]
      });

      const userReviewsArray = [];

      curUserReviews.forEach(reviews => {
            userReviewsArray.push(reviews.toJSON());
      });

      userReviewsArray.forEach(review => {

            if (review.Spot.SpotImages.length) {
                  const {SpotImages} = review.Spot;

                  SpotImages.forEach(image => {

                        if (image.preview === true) {
                              const {url} = image
                              review.Spot.previewImage = url
                        } else review.Spot.previewImage = "There are no preview images";

                  });

            } else review.Spot.previewImage = "There are no preview images";

            delete review.Spot.SpotImages;

            if (review.ReviewImages.length) {

                  review.ReviewImages.forEach(img => {
                        delete img.reviewId;
                        delete img.createdAt;
                        delete img.updatedAt;
                  });
            } else review.ReviewImages = "There are no current images";

      });

      if(curUserReviews.length) {
            return res.json({"Reviews": userReviewsArray});
      } else return res.json({message: "You don't have any current reviews"});

});

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {

      const { url } = req.body;

      const curReview = await Review.findByPk(req.params.reviewId);

      if (!curReview) {
            res.status(404);
            return res.json({"message": "Review couldn't be found"});
      };

      if (curReview.userId !== req.user.id) {
            res.status(403);
            return res.json({
                  "message": "Forbidden"
                })
      };

      const countReviewImages = await ReviewImage.count({
            where: {
                  reviewId: curReview.id
            }
      });

      if (countReviewImages >= 10) {
            res.status(403);
            return res.json({"message": "Maximum number of images for this resource was reached"});
      };

            const newReviewImg = await ReviewImage.create({
                  url,
                  reviewId: curReview.id
            });

            const { id } = newReviewImg;

            const finalReviewImg = {
                  id,
                  url
            };

            return res.json(finalReviewImg);

});

router.put("/:reviewId", requireAuth, async (req, res, next) => {

      const { review, stars } = req.body;

      const curReview = await Review.findByPk(req.params.reviewId);

      if(!curReview) {
            res.status(404);
            return res.json({"message": "Review couldn't be found"});
      };

      if(curReview.userId !== req.user.id) {
            res.status(403);
            return res.json({
                  "message": "Erorr: Forbidden"
                })
      };

            const updatedReview = await curReview.update({
                  review,
                  stars
            });

            return res.json(updatedReview);
});

router.delete("/:reviewId", requireAuth, async (req, res, next) => {

      const curReview = await Review.findByPk(req.params.reviewId);

      if(!curReview) {
            res.status(404);
            return res.json({"message": "Review couldn't be found"});
      };

      if(curReview.userId !== req.user.id) {
            res.status(403);
            return res.json({
                  "message": "Forbidden"
                })
      };

            curReview.destroy();
            return res.json({"message": "Successfully deleted"});
});

module.exports = router;