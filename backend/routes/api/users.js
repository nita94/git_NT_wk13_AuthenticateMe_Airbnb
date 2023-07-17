// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, Booking, ReviewImage, SpotImage  } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  const allEmails = await User.findAll({
      attributes: ['email']
  });


  const emailArray = [];

  allEmails.forEach(emaill => {
      const emailObjects = (emaill.toJSON());
      const emails = (Object.values(emailObjects));
      emails.forEach(target => {
        emailArray.push(target);
      });
  });

  if(emailArray.includes(email)) {
      res.status(500);
      return res.json({
        "message": "User already exists",
        "errors": {
          "email": "User with that email already exists"
        }
      });
  };

  const allUsernames = await User.findAll({
    attributes: ['username']
  });


  const usernameArray = [];

  allUsernames.forEach(userss => {
      const usersObjects = (userss.toJSON());
      const usersss = (Object.values(usersObjects));
      usersss.forEach(target => {
        usernameArray.push(target);
      });
  });

  if(usernameArray.includes(username)) {
      res.status(500);
      return res.json({
        "message": "User already exists",
        "errors": {
          "username": "User with that username already exists"
        }
      })
  };

  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ firstName, lastName, email, username, hashedPassword });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;