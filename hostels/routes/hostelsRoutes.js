const express = require("express");
const { getAllFloors, setFloors } = require("../controllers/floorsController");
const { setRooms, getRoom, getRoomsForFloor } = require("../controllers/roomsController");
const { bookRoom, findAlreadyBooked } = require("../controllers/bookingController");
const { createRooms, createSpecialRooms, bookedData } = require("../controllers/adminControllers");
const router = express.Router();


router.route("/getfloors").get(getAllFloors);
router.route("/setfloors").post(setFloors);
router.route("/setrooms").post(setRooms);
router.route("/getroom").get(getRoom);
router.route("/getroomsforfloor").get(getRoomsForFloor);
router.route("/bookroom").post(bookRoom);

router.route("/isalreadypresent").post(findAlreadyBooked);
router.route("/createRooms").post(createRooms);
router.route("/createSpecialRooms").post(createSpecialRooms);
router.route("/getBookedData").get(bookedData);




module.exports  = router;
