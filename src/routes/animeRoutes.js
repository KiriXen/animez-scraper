const express = require("express");
const { getLatestAnime } = require("../controllers/animeController");

const router = express.Router();

router.get("/latest", getLatestAnime); // Supports pagination via query parameters

module.exports = router;
