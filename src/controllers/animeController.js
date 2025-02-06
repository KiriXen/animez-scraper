const { scrapeLatestAnime } = require("../scrapers/animeScraper");

const getLatestAnime = async (req, res) => {
    const page = req.query.page || 1; // Default to page 1 if no query parameter is provided

    try {
        const animeList = await scrapeLatestAnime(page);
        res.json(animeList);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch anime data" });
    }
};

module.exports = { getLatestAnime };
