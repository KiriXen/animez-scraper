const { scrapeLatestAnime, scrapeAnimeDetails } = require("../scrapers/animeScraper");

const getLatestAnime = async (req, res) => {
    const page = req.query.page || 1;

    try {
        const animeList = await scrapeLatestAnime(page);
        res.json(animeList);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch anime data" });
    }
};

const getAnimeDetails = async (req, res) => {
    const { animeId } = req.params;
    const type = req.query.type?.toLowerCase() === 'dub' ? 'dub' : 'sub';

    try {
        const animeDetails = await scrapeAnimeDetails(animeId, type);
        res.json(animeDetails);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch anime details" });
    }
};

module.exports = { getLatestAnime, getAnimeDetails };