const express = require("express");
const { createFaculty, loginFaculty, getFacultyData, getFacultyByDepartment, getFacultyTimeTable, getFacultyByDepartmentShort, getFacultyById, updateFaculty, assignDataToFaculty } = require("../controllers/facultyConttroller");
const validateToken = require("../middleware/tokenValidator");
const { AssignSubstitute, settingSubstitute, acceptRequest } = require("../controllers/assignSubstituteController");
const router = express.Router();

router.route("/create").post(createFaculty);
router.route("/login").post(loginFaculty);
router.route("/getFacultydata").get(validateToken, getFacultyData);
router.route("/getDepartmentVise").get(getFacultyByDepartment);
router.route("/getFacultyTimeTable").get(validateToken,getFacultyTimeTable);

router.route("/assignsubstitute").post(AssignSubstitute);
router.route("/settSubstitute").post(settingSubstitute);
router.route("/acceptRequest").post(acceptRequest);

router.route('/getfacultybydeptshort').get(getFacultyByDepartmentShort);
router.route('/getfacultybyId').post(getFacultyById);
router.route('/updateFaculty').post(updateFaculty);


router.route('/asssignTimeTableTofaculty').get(assignDataToFaculty);
module.exports = router;