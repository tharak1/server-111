const express = require("express");
const validateToken = require("../middleware/tokenValidator");
const { createAttendance, getAttendance } = require("../controllers/attendanceController");
const { setAttendance, adjustAttendance, adgustAttendanceUpdate } = require("../controllers/markAttendanceController");
const { updatePercentageAtMidnight } = require("../controllers/attendanceDBcontroller");

const router = express.Router();

router.route("/createatt").post(createAttendance);
router.route("/getatten").get(validateToken,getAttendance);
router.route("/setAttendance").post(setAttendance);
router.route("/updateattendanceatmidnight").get(updatePercentageAtMidnight);
router.route("/getAdjustRno").post(adjustAttendance);
router.route("/setAdjustRno").post(adgustAttendanceUpdate);

module.exports = router;