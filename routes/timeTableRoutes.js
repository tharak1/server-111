const express = require("express");
const { setTimeTable, getTimeTable, convertTimeTable } = require("../controllers/TimeTableController1");

const router = express.Router();

router.route("/ab").post(setTimeTable);
router.route("/getsectionSpecificTimeTable").get(getTimeTable);

router.route("/assignFacultyTimeTable").get(convertTimeTable);



module.exports =  router; 