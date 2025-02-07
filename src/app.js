const express = require("express");
const cors = require("cors");
const animeRoutes = require("./routes/animeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({
        message: "Welcome to AnimeZ API! Made by @KiriXen",
        documentation: "https://github.com/KiriXen/animez-scraper",
    });
});

app.use("/api/anime", animeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AnimeZ API is running on http://localhost:${PORT}`);
    console.log("🌟 Made by @KiriXen - Feel free to contribute!");
});
