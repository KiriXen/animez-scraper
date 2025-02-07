const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animez.org";

const scrapeEpisodeVideo = async (animeId, episodeId) => {
    try {
        // Construct the full URL for the episode
        const episodeUrl = `${BASE_URL}/${animeId}/${episodeId}`;
        
        // Fetch the episode page
        const response = await axios.get(episodeUrl);
        const $ = cheerio.load(response.data);
        
        // Get the iframe source URL
        const iframeSrc = $("#anime_player iframe").attr("src");
        
        if (!iframeSrc) {
            throw new Error("Video source not found");
        }

        // Get episode number from the breadcrumb
        const episodeText = $(".breadcrumb-item:last").text().trim();
        let episodeNumber = "";
        let type = "sub";

        // Parse episode number and type
        if (episodeText.toLowerCase().includes("epi")) {
            const match = episodeText.match(/Epi\s*(\d+)(?:-Dub)?/i);
            if (match) {
                episodeNumber = match[1];
                type = episodeText.toLowerCase().includes("dub") ? "dub" : "sub";
            }
        }

        // If episode number wasn't found in breadcrumb, try parsing from episodeId
        if (!episodeNumber) {
            const idMatch = episodeId.match(/epi-(\d+)(?:dub)?-/i);
            if (idMatch) {
                episodeNumber = idMatch[1];
                type = episodeId.toLowerCase().includes("dub") ? "dub" : "sub";
            }
        }

        return {
            title: $("h2.SubTitle").text().trim(),
            episode: {
                number: episodeNumber,
                type: type,
                label: `Episode ${episodeNumber}${type === 'dub' ? ' (Dubbed)' : ''}`
            },
            videoUrl: iframeSrc
        };
    } catch (error) {
        console.error("Error scraping episode video:", error);
        throw error;
    }
};

module.exports = { scrapeEpisodeVideo };