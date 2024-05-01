const express = require("express");
const { getAllSemMarks, createSemmarks, semMarksIndividual } = require("../controllers/semMarksController");

const router = express.Router();


router.route("/").get(getAllSemMarks);
router.route("/").post(createSemmarks);
router.route("/find").get(semMarksIndividual);

module.exports = router;