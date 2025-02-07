const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animez.org";

const scrapeTopAnime = async () => {
    try {
        const url = BASE_URL;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const topAnimeList = [];

        $(".MovieListTop .TPostMv").each((_, element) => {
            const anime = $(element);
            const link = anime.find("a").attr("href");
            const title = anime.find(".Title").text().trim();
            const image = anime.find("img").attr("src");
            const episodes = anime.find(".mli-eps i").text().trim();
            const rating = anime.find(".anime-avg-user-rating").text().trim() || "N/A";

            const id = link?.split("/").filter(Boolean).pop() || "";

            topAnimeList.push({
                id,
                title,
                image: image ? `${BASE_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}` : null,
                episodes,
                rating,
                url: link ? `${BASE_URL}${link}` : null
            });
        });

        return topAnimeList;
    } catch (error) {
        console.error("Error scraping top anime:", error.message);
        return [];
    }
};

const scrapeLatestAnime = async (page = 1) => {
    try {
        const url = `${BASE_URL}/?act=home&pageNum=${page}#pages`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const animeList = [];

        $("ul.MovieList.Rows .TPostMv").each((_, element) => {
            const title = $(element).find(".Title").text().trim();
            const animeUrl = $(element).find("a").attr("href");
            const image = BASE_URL + "/" + $(element).find("img").attr("src");
            const episode = $(element).find(".mli-eps i").text().trim();
            const views = $(element).find(".Year").text().replace("View ", "").trim();
            const rating = $(element).find(".anime-extras .anime-avg-user-rating").text().trim() || "N/A";

            const id = animeUrl?.split('/').filter(Boolean).pop() || '';

            animeList.push({ title, id, image, episode, views, rating });
        });

        return animeList;
    } catch (error) {
        console.error("Error scraping anime:", error.message);
        return [];
    }
};

const scrapeAnimeDetails = async (animeId, type = 'sub') => {
    try {
        const response = await axios.get(`${BASE_URL}/${animeId}`);
        const $ = cheerio.load(response.data);
        
        const title = $("h2.SubTitle").text().trim();
        
        const image = BASE_URL + "/" + $(".Image figure img").attr("src");
        
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
        
        const summary = $("#summary_shortened").text().trim() || "No summary available.";
        
        const allEpisodes = [];
        $("#list_chapter_id_detail li").each((_, element) => {
            const episodeLink = $(element).find("a");
            const episodeNumber = episodeLink.text().trim();
            const episodeUrl = episodeLink.attr("href");
            
            const urlParts = episodeUrl.split("/");
            const episodeId = urlParts[urlParts.length - 2];
            
            allEpisodes.push({
                number: episodeNumber,
                url: episodeId,
                type: episodeNumber.toLowerCase().includes('dub') ? 'dub' : 'sub'
            });
        });

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
                return numB - numA;
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

module.exports = { scrapeLatestAnime, scrapeAnimeDetails, scrapeTopAnime };