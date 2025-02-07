const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animez.org";

// Status and sort options from the HTML
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

const scrapeSearch = async (query, options = {}) => {
    try {
        const {
            status = 'all',
            sortBy = 'lastest-chap',
            page = 1
        } = options;

        // Construct search URL
        const searchUrl = `${BASE_URL}/?act=search&f[status]=${status}&f[sortby]=${sortBy}&f[keyword]=${encodeURIComponent(query)}&pageNum=${page}#pages`;

        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        
        // Get current active status and sort
        const activeStatus = $('.Top .row:first-child .btn.active').text().trim().toLowerCase();
        const activeSort = $('.Top .row:nth-child(2) .btn.active').text().trim();

        // Extract available filters
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

        // Extract search results
        const results = [];
        $('.MovieList .TPostMv').each((_, element) => {
            const anime = $(element);
            const link = anime.find('a').attr('href');
            const title = anime.find('h2.Title').text().trim();
            const image = anime.find('img').attr('src');
            const episodes = anime.find('.mli-eps').text().trim();
            
            // Extract ID from URL
            const id = link?.split('/').filter(Boolean).pop() || '';

            results.push({
                id,
                title,
                image: image ? `${image}` : null,
                episodes,
                url: link ? `${BASE_URL}${link}` : null
            });
        });

        // Extract pagination
        const totalPages = $('.pagination .page-item').length;
        const currentPage = $('.pagination .page-item.active .page-link').text();

        return {
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
            pagination: {
                currentPage: parseInt(currentPage) || 1,
                totalPages: totalPages || 1
            },
            results
        };
    } catch (error) {
        console.error("Error scraping search results:", error);
        throw error;
    }
};

module.exports = { scrapeSearch, STATUS_OPTIONS, SORT_OPTIONS };