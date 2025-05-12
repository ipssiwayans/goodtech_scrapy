const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB local
mongoose
  .connect(process.env.MONGO_URI, {})
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


// Schéma pour les catégories
const categorySchema = new mongoose.Schema({
  category: String,
  total_articles: Number,
  last_updated: Date,
  articles: [{
    title: String,
    url: String,
    date: Date
  }]
});
const Category = mongoose.model("Categories", categorySchema, "category_articles");

// Route pour récupérer les catégories
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ total_articles: -1 });
    res.json({ 
      categories,
      total: categories.length,
      totalArticles: categories.reduce((sum, cat) => sum + cat.total_articles, 0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
