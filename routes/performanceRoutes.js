const express = require("express");
const { createPerformance, getPerformance, initPerformance, initPerformanceAll } = require("../controllers/performanceController");
const router = express.Router();
const validateToken = require("../middleware/tokenValidator");

router.route("/createper").post(createPerformance);
router.route("/getper").get(validateToken,getPerformance);
router.route("/convertSeries").get(initPerformance);
router.route("/convertAll").get(initPerformanceAll);

module.exports = router;
