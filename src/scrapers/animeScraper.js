const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animez.org";

const scrapeLatestAnime = async (page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/page/${page}`);
        const $ = cheerio.load(response.data);
        const animeList = [];

        $("article.TPost").each((_, element) => {
            const title = $(element).find("h2.Title").text().trim();
            const link = $(element).find("a").attr("href");
            const image = $(element).find("img").attr("src");
            const id = link ? link.split("/").filter(Boolean).pop() : "";

            animeList.push({
                id,
                title,
                link: `${BASE_URL}${link}`,
                image
            });
        });

        return animeList;
    } catch (error) {
        console.error("Error scraping latest anime:", error);
        throw error;
    }
};

const scrapeAnimeDetails = async (animeId, type = 'sub') => {
    try {
        const response = await axios.get(`${BASE_URL}/${animeId}`);
        const $ = cheerio.load(response.data);
        
        // Get title
        const title = $("h2.SubTitle").text().trim();
        
        // Get image
        const image = $(".Image figure img").attr("src");
        
        // Get alternative names
        const infoList = $(".InfoList li");
        let alternativeNames = "N/A";
        let animeType = "Unknown";
        let status = "Unknown";
        let genres = [];
        
        infoList.each((_, element) => {
            const strong = $(element).find("strong").text().trim();
            const text = $(element).text().replace(strong, "").trim();
            
            switch(strong) {
                case "Alternative:":
                    alternativeNames = text || "N/A";
                    break;
                case "Type:":
                    animeType = text || "Unknown";
                    break;
                case "Status:":
                    status = text || "Unknown";
                    break;
                case "Genres:":
                    genres = $(element)
                        .find("a")
                        .map((_, el) => $(el).text().trim())
                        .get()
                        .filter(Boolean);
                    break;
            }
        });
        
        // Get summary
        const summary = $("#summary_shortened").text().trim() || "No summary available.";
        
        // Get episodes and separate sub/dub
        const allEpisodes = [];
        $("#list_chapter_id_detail li").each((_, element) => {
            const episodeLink = $(element).find("a");
            const episodeNumber = episodeLink.text().trim();
            const episodeUrl = episodeLink.attr("href");
            
            // Extract just the episode identifier from the URL
            const urlParts = episodeUrl.split("/");
            const episodeId = urlParts[urlParts.length - 2]; // Get the second-to-last part
            
            allEpisodes.push({
                number: episodeNumber,
                url: episodeId,
                type: episodeNumber.toLowerCase().includes('dub') ? 'dub' : 'sub'
            });
        });

        // Filter episodes based on type parameter
        const episodes = allEpisodes
            .filter(episode => episode.type === type)
            .map(episode => ({
                number: episode.type === 'dub' 
                    ? episode.number.replace('-Dub', '').replace('dub', '') 
                    : episode.number,
                url: episode.url
            }))
            .sort((a, b) => {
                const numA = parseInt(a.number);
                const numB = parseInt(b.number);
                return numB - numA;  // Sort in descending order (newest first)
            });
        
        return {
            title,
            image,
            alternativeNames,
            type: animeType,
            status,
            genres: genres.length > 0 ? genres : ["Unknown"],
            summary,
            episodes,
            availableTypes: {
                sub: allEpisodes.some(ep => ep.type === 'sub'),
                dub: allEpisodes.some(ep => ep.type === 'dub')
            }
        };
    } catch (error) {
        console.error("Error scraping anime details:", error);
        throw error;
    }
};

module.exports = { scrapeLatestAnime, scrapeAnimeDetails };