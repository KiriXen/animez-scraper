const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animez.org";

const STATUS_OPTIONS = {
    all: "All",
    complete: "Complete",
    "in-process": "In process",
    pause: "Pause"
};

const SORT_OPTIONS = {
    "lastest-chap": "Latest update",
    hot: "Hot",
    "lastest-manga": "New",
    "top-manga": "Top all",
    "top-month": "Top month",
    "top-week": "Top week",
    "top-day": "Top day",
    follow: "Follow",
    comment: "Comment",
    "num-chap": "Num. Episode"
};

const scrapeGenre = async (genre, options = {}) => {
    try {
        const {
            status = 'all',
            sortBy = 'lastest-chap',
            page = 1
        } = options;

        const genreUrl = `${BASE_URL}/?act=search&f[status]=${status}&f[sortby]=${sortBy}&f[genres]=${encodeURIComponent(genre)}&pageNum=${page}#pages`;

        const response = await axios.get(genreUrl);
        const $ = cheerio.load(response.data);
        
        const activeStatus = $('.Top .row:first-child .btn.active').text().trim().toLowerCase();
        const activeSort = $('.Top .row:nth-child(2) .btn.active').text().trim();

        const statusFilters = [];
        $('.Top .row:first-child .btn').each((_, element) => {
            const btn = $(element);
            statusFilters.push({
                value: btn.attr('href')?.match(/f\[status\]=([^&]+)/)?.[1] || 'all',
                label: btn.text().trim(),
                active: btn.hasClass('active')
            });
        });

        const sortFilters = [];
        $('.Top .row:nth-child(2) .btn').each((_, element) => {
            const btn = $(element);
            sortFilters.push({
                value: btn.attr('href')?.match(/f\[sortby\]=([^&]+)/)?.[1] || 'lastest-chap',
                label: btn.text().trim(),
                active: btn.hasClass('active')
            });
        });

        const results = [];
        $('.MovieList .TPostMv').each((_, element) => {
            const anime = $(element);
            const link = anime.find('a').attr('href');
            const title = anime.find('h2.Title').text().trim();
            const image = anime.find('img').attr('src');
            const episodes = anime.find('.mli-eps').text().trim();
            
            const id = link?.split('/').filter(Boolean).pop() || '';

            results.push({
                id,
                title,
                image: image ? `${BASE_URL.replace(/\/$/, "")}/${image.replace(/^\//, "")}` : null,
                episodes: parseInt(episodes) || 0,
                url: link ? `${BASE_URL}${link}` : null
            });
        });

        const pagination = {
            currentPage: parseInt(page),
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
        };

        $('.pagination .page-item').each((_, element) => {
            const pageText = $(element).find('.page-link').text().trim();
            if (pageText === 'Last') {
                const lastPageHref = $(element).find('.page-link').attr('href');
                const lastPageMatch = lastPageHref?.match(/pageNum=(\d+)/);
                if (lastPageMatch) {
                    pagination.totalPages = parseInt(lastPageMatch[1]);
                }
            }
        });

        pagination.hasNextPage = pagination.currentPage < pagination.totalPages;
        pagination.hasPrevPage = pagination.currentPage > 1;

        return {
            genre,
            filters: {
                status: {
                    options: statusFilters,
                    active: activeStatus
                },
                sortBy: {
                    options: sortFilters,
                    active: activeSort
                }
            },
            pagination,
            results
        };
    } catch (error) {
        console.error("Error scraping genre results:", error);
        throw error;
    }
};

module.exports = { scrapeGenre, STATUS_OPTIONS, SORT_OPTIONS };