const express = require("express");
const { addSemesterData, updateSemesterData, fetchAcademicmonths, getSubjectsForClass } = require("../controllers/acedemicsController");
const router = express.Router();

router.route("/").post(addSemesterData);
router.route("/update").post(updateSemesterData);
router.route("/fetch").get(fetchAcademicmonths);
router.route("/getSubjectsForClass").get(getSubjectsForClass);


module.exports = router;