const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB local
mongoose
  .connect("mongodb://localhost:27017/goodtech", {})
  .then(() => console.log("Connected to local MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schéma pour les articles
const articleSchema = new mongoose.Schema({
  title: String,
  url: { type: String, unique: true },
  date: Date,
  summary: String,
  image_url: String,
});
const Article = mongoose.model("Articles", articleSchema, "recent_articles");

app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json({ articles, total: articles.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
