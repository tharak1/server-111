const express = require("express");
const { createBook, getAllBooks, getBook, getBooksForCategory } = require("../controllers/booksController");
const router = express.Router();

router.route('/createbook').post(createBook);
router.route('/getallbooks').get(getAllBooks);
router.route('/getbook').get(getBooksForCategory);

module.exports = router;