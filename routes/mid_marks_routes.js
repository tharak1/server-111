const express = require("express");
const { giveRnoForSelectedSub, findSubjectsWithTheCurrentFaculty, updateMidMarks } = require("../controllers/midMarksController");
// const { route } = require("./attendanceHistoryRoutes");

const router = express.Router();

router.route("/getInfo").post(findSubjectsWithTheCurrentFaculty);
router.route("/getData").post(giveRnoForSelectedSub);
router.route("/update").post(updateMidMarks);

module.exports = router;