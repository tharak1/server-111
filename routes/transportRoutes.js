const express = require("express");
const { createBus, getAllBuses, setLiveLocation } = require("../controllers/transportController");
const router = express.Router();

router.route("/createbus").post(createBus);
router.route("/getbuses").get(getAllBuses);
router.route("/setlivelocation").post(setLiveLocation);

module.exports = router;