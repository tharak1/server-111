const express  = require("express");
const { createLibrary, booksget, getLib, addLibBooks, updateDate, addToLibrary, removeFromLibrary } = require("../controllers/libraryController");
const validateToken = require("../middleware/tokenValidator");
const router = express.Router();

router.route("/createlib").post(createLibrary);
router.route("/").get(validateToken,booksget);
router.route("/getlib").get(validateToken,getLib);
router.route("/addBooks").post(addLibBooks);
router.route("/update").post(addToLibrary);
router.route("/remove").post(removeFromLibrary);
router.route("/updatedate").post(updateDate);
module.exports = router;