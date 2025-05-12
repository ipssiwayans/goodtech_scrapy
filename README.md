# GoodTech News Aggregator

A full-stack application for scraping, storing, and displaying positive tech news articles from [goodtech.info](https://goodtech.info/).

## Project Overview

This project consists of three main components:

1. **Scrapy Spider**: A web scraper that collects articles from goodtech.info
2. **Backend API**: An Express.js server that serves article data from MongoDB
3. **Frontend Application**: A React application that displays the articles with filtering and statistics

The application automatically collects new articles daily and provides a clean, modern interface for browsing and filtering tech news with a positive focus.

## Architecture

```
goodtech_scrapy/
├── goodtech/               # Scrapy project for web scraping
│   ├── goodtech/           # Scrapy spider code
│   ├── run_recent_articles.py  # Script to run the spider
│   └── crontab.txt         # Cron job configuration
├── backend/                # Express.js backend
│   ├── server.js           # Main server file
│   └── .env                # Environment variables
└── frontend/               # React frontend
    ├── src/                # Source code
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   └── services/       # API services
    └── index.html          # Entry HTML file
```

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- pip (Python package manager)
- npm (Node package manager)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/goodtech_scrapy.git
cd goodtech_scrapy
```

### 2. Set up the Scrapy project

```bash
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Make the spider script executable
chmod +x goodtech/run_recent_articles.py
```

### 3. Set up the backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/goodtech" > .env
echo "PORT=5000" >> .env
```

### 4. Set up the frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

## Usage

### Running the Scrapy Spider

You can run the Scrapy command (limit is using to determine how many pages to scrape):

```bash
cd goodtech
scrapy crawl recent_articles -a limit=1 #determine how many pages to scrape (int)
```

### Setting up the Cron Job

To automatically run the spider daily:

```bash
# Install the cron job
crontab -l > current_crontab
cat goodtech/crontab.txt >> current_crontab
crontab current_crontab
rm current_crontab

# Verify installation
crontab -l
```

Logs from the cron job are stored in `goodtech/cron.log`. You can monitor these logs to ensure the spider is running correctly:

```bash
tail -f goodtech/cron.log
```

### Running the Backend

```bash
cd backend
npm run dev  # Uses nodemon for development
# or
npm start    # For production
```

### Running the Frontend

```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

## Features

### Scrapy Spider
- Scrapes articles from goodtech.info
- Stores article data in MongoDB
- Configurable to limit the number of pages scraped
- Scheduled to run daily via cron job

The project includes two spiders:
- `recent_articles`: Scrapes recent articles from the main page of goodtech.info
- `article_detail`: Scrapes detailed information about articles

### Backend API
- RESTful API built with Express.js
- Serves article data from MongoDB
- Handles sorting and filtering of articles

#### API Endpoints

##### GET /articles

Returns a list of all articles sorted by date (newest first).

**Response:**

```json
{
  "articles": [
    {
      "_id": "...",
      "title": "Article Title",
      "url": "https://example.com/article",
      "date": "2023-05-12T10:30:00.000Z",
      "summary": "Article summary text...",
      "image_url": "https://example.com/image.jpg"
    },
    ...
  ],
  "total": 123
}
```

### Frontend Application
- Modern UI built with React and TailwindCSS
- Article filtering by title
- Sorting by date (newest/oldest)
- Statistics dashboard with charts
- Responsive design for mobile and desktop
- Infinite scrolling for article list

## Statistics Dashboard

The frontend includes a statistics dashboard that shows:
- Total number of articles
- Articles published in the current month
- Articles published today
- Monthly article distribution (bar chart)
- Daily article distribution (line chart)

## Acknowledgements

- [goodtech.info](https://goodtech.info/) for providing positive tech news
- [Scrapy](https://scrapy.org/) for the web scraping framework
- [Express.js](https://expressjs.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend library
- [TailwindCSS](https://tailwindcss.com/) for the CSS framework
- [Chart.js](https://www.chartjs.org/) for the charts
