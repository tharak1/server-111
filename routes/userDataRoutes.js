const express = require("express");
const { createUserData, getUserData, deleteUserData, deleteAllUsersData, getallUserData, validateUser, getAllUsersDataAsSection, loginUser, getStudentsDataFORchat, getParentsForChat, getFacultyForChat, getFacultyStudentForChat } = require("../controllers/userDataController");
const validateToken = require("../middleware/tokenValidator");

const router = express.Router();

router.route('/createuserdata').post(createUserData);
router.route('/getalluserdata').get(getallUserData);
router.route('/getuserdata').get( validateToken,getUserData);
router.route('/validateuser').get( validateToken,validateUser);
router.route('/deleteuserdata/:id').delete(deleteUserData);
router.route('/deletealluserdata').delete(deleteAllUsersData);
router.route('/filter').get(getAllUsersDataAsSection);
router.route('/login').post(loginUser);

router.route('/getstudentsdataforchat').post(getStudentsDataFORchat);
router.route('/getparentsdataforchat').post(getParentsForChat);
router.route('/getfacultydataforchat').post(getFacultyForChat);
router.route('/getfacultystudentdataforchat').post(getFacultyStudentForChat);

module.exports = router;

