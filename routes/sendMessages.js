const express = require("express");
const { sendMessage } = require("../controllers/sendMessages");

const router = express.Router();

router.route("/").post(sendMessage);

module.exports = router;