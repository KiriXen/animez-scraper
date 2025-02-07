const { scrapeEpisodeVideo } = require("../scrapers/episodeScraper");

const getEpisodeVideo = async (req, res) => {
    const { animeId, episodeId } = req.params;

    try {
        const videoData = await scrapeEpisodeVideo(animeId, episodeId);
        res.json(videoData);
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch episode video",
            message: error.message 
        });
    }
};

module.exports = { getEpisodeVideo };