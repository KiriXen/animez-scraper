const express = require("express");
const { getLatestAnime, getAnimeDetails } = require("../controllers/animeController");
const { getEpisodeVideo } = require("../controllers/episodeController");
const { searchAnime } = require("../controllers/searchController");
const { getAnimeByGenre } = require("../controllers/genreController");

const router = express.Router();

router.get("/latest", getLatestAnime);
router.get("/search", searchAnime);
router.get("/genre/:genre", getAnimeByGenre);
router.get("/details/:animeId", getAnimeDetails);
router.get("/:animeId/:episodeId", getEpisodeVideo);


module.exports = router;