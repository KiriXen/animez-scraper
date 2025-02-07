const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animez.org";

const scrapeEpisodeVideo = async (animeId, episodeId) => {
    try {
        const episodeUrl = `${BASE_URL}/${animeId}/${episodeId}`;
        
        const response = await axios.get(episodeUrl);
        const $ = cheerio.load(response.data);
        
        const iframeSrc = $("#anime_player iframe").attr("src");
        
        if (!iframeSrc) {
            throw new Error("Video source not found");
        }

        const episodeText = $(".breadcrumb-item:last").text().trim();
        let episodeNumber = "";
        let type = "sub";

        if (episodeText.toLowerCase().includes("epi")) {
            const match = episodeText.match(/Epi\s*(\d+)(?:-Dub)?/i);
            if (match) {
                episodeNumber = match[1];
                type = episodeText.toLowerCase().includes("dub") ? "dub" : "sub";
            }
        }

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