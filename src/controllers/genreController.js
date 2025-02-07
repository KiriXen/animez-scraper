const { scrapeGenre } = require("../scrapers/genreScraper");

const getAnimeByGenre = async (req, res) => {
    const { genre } = req.params;
    const { status, sortBy, page } = req.query;

    try {
        const genreResults = await scrapeGenre(genre, {
            status: status || 'all',
            sortBy: sortBy || 'lastest-chap',
            page: parseInt(page) || 1
        });

        const { filters, ...responseWithoutFilters } = genreResults;

        res.json(responseWithoutFilters);
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch genre results",
            message: error.message 
        });
    }
};

module.exports = { getAnimeByGenre };
