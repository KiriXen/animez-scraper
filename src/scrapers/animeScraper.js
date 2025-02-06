const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animez.org";

const scrapeLatestAnime = async (page = 1) => {
    try {
        const url = `${BASE_URL}/?act=home&pageNum=${page}#pages`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const animeList = [];

        $("ul.MovieList.Rows .TPostMv").each((_, element) => {
            const title = $(element).find(".Title").text().trim();
            const animeUrl = BASE_URL + $(element).find("a").attr("href");
            const image = BASE_URL + "/" + $(element).find("img").attr("src");
            const episode = $(element).find(".mli-eps i").text().trim();
            const views = $(element).find(".Year").text().replace("View ", "").trim();
            const rating = $(element).find(".anime-avg-user-rating i.fa-star").next().text().trim() || "N/A";

            animeList.push({ title, url: animeUrl, image, episode, views, rating });
        });

        return animeList;
    } catch (error) {
        console.error("Error scraping anime:", error.message);
        return [];
    }
};

module.exports = { scrapeLatestAnime };
