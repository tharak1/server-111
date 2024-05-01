const express = require("express");
const { setLocation, getLocation } = require("../controllers/locationController");
const router = express.Router();

router.route("/").post(setLocation);
router.route("/get").get(getLocation);

module.exports=router;