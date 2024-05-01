const express = require("express");
const { assignAttendance, DataToExcel, dataToExcelForIndividualClassSubjects, getAttendanceByHistories, getAttendanceByHistoriesForSpecificSubject } = require("../controllers/attendanceHistoryController");
const validateToken = require("../middleware/tokenValidator");

const router = express.Router();

router.route("/").get(assignAttendance);
router.route("/downloadAttendance").post(DataToExcel);
router.route("/downloadSubjectWiseAttendance").get(dataToExcelForIndividualClassSubjects);
router.route("/getAttendanceByHistories").get(validateToken,getAttendanceByHistories);
router.route("/getSubjectWiseAttendance").get(getAttendanceByHistoriesForSpecificSubject);

module.exports = router;