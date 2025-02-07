const { scrapeGenre, STATUS_OPTIONS, SORT_OPTIONS } = require("../scrapers/genreScraper");

const getAnimeByGenre = async (req, res) => {
    const { genre } = req.params;
    const { status, sortBy, page } = req.query;

    try {
        const genreResults = await scrapeGenre(genre, {
            status: status || 'all',
            sortBy: sortBy || 'lastest-chap',
            page: parseInt(page) || 1
        });

        res.json({
            query: req.query,
            availableOptions: {
                status: STATUS_OPTIONS,
                sortBy: SORT_OPTIONS
            },
            ...genreResults
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch genre results",
            message: error.message 
        });
    }
};

module.exports = { getAnimeByGenre };
