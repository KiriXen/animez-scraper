const { scrapeSearch, STATUS_OPTIONS, SORT_OPTIONS } = require("../scrapers/searchScraper");

const searchAnime = async (req, res) => {
    const { query, status, sortBy, page } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        const searchResults = await scrapeSearch(query, {
            status: status || 'all',
            sortBy: sortBy || 'lastest-chap',
            page: parseInt(page) || 1
        });

        res.json({
            query,
            availableOptions: {
                status: STATUS_OPTIONS,
                sortBy: SORT_OPTIONS
            },
            ...searchResults
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to search anime",
            message: error.message 
        });
    }
};

module.exports = { searchAnime };