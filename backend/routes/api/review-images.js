const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {

      const curImage = await ReviewImage.findByPk(req.params.imageId);

      if (!curImage) {
            res.status(404);
            return res.json({"message": "Review Image couldn't be found"});
      };

      const curReview = await Review.findOne({
            where: {
                  id: curImage.reviewId
            }
      });

      if (curReview.userId !== req.user.id) {
            res.status(403);
            return res.json({"message": "Error:Forbidden"})
      };

      curImage.destroy();
      return res.json({"message": "Successfully deleted"});

});




module.exports = router;