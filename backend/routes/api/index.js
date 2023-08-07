// remember to import this to routes/index.js and connect it to the router there
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const spotImagesRouter = require("./spot-images.js");
const reviewImagesRouter = require("./review-images.js");

const bookingsRouter = require("./bookings.js");
//keep the restoreUser middleware
const { restoreUser } = require("../../utils/auth.js");

//routers
router.use(restoreUser); // global middleware
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/spot-images", spotImagesRouter);
router.use("/review-images", reviewImagesRouter);

router.use("/bookings", bookingsRouter);

// test route - removed this after implementing the csrfFetch for the frontend
// router.post("/test", function (req, res) {
//   res.json({ requestBody: req.body });
// });

/* TESTING SET-TOKEN-COOKIE, RESTOREUSER, REQUIRE-AUTH
// test route for restoreUser
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser); // global middleware

router.get("/restore-user", (req, res) => {
  return res.json(req.user);
});

// test route for set-token-cookie
const { setTokenCookie } = require("../../utils/auth.js");
const { User } = require("../../db/models");
router.get("/set-token-cookie", async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: "Demo-lition",
    },
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// test route for require-auth
const { requireAuth } = require("../../utils/auth.js");
router.get("/require-auth", requireAuth, (req, res) => {
  return res.json(req.user);
});
*/

module.exports = router;