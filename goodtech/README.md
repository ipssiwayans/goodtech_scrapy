# GoodTech Scrapy Project

This is a Scrapy project for scraping articles from goodtech.info.

## Spiders

- `recent_articles`: Scrapes recent articles from the main page of goodtech.info
- `article_detail`: Scrapes detailed information about articles

## Cron Job Setup

A cron job has been set up to run the `recent_articles` spider every 24 hours with a limit of 1 page. This ensures that the database is regularly updated with the latest articles.

### How to Install the Cron Job

1. Make sure the script is executable:
   ```bash
   chmod +x /home/stomen/GitHub/goodtech_scrapy/goodtech/run_recent_articles.py
   ```

2. Install the cron job:
   ```bash
   crontab -l > current_crontab
   cat /home/stomen/GitHub/goodtech_scrapy/goodtech/crontab.txt >> current_crontab
   crontab current_crontab
   rm current_crontab
   ```

3. Verify that the cron job is installed:
   ```bash
   crontab -l
   ```

### Manual Execution

You can also run the spider manually:

```bash
cd /home/stomen/GitHub/goodtech_scrapy/goodtech
/home/stomen/GitHub/goodtech_scrapy/.venv/bin/python run_recent_articles.py
```

Or using the Scrapy command:

```bash
cd /home/stomen/GitHub/goodtech_scrapy/goodtech
scrapy crawl recent_articles -a limit=1
```

## Logs

Logs from the cron job are stored in `/home/stomen/GitHub/goodtech_scrapy/goodtech/cron.log`.