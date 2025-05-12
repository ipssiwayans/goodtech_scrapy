from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from goodtech.spiders.recent_articles import RecentArticlesSpider

def run_spider():
    settings = get_project_settings()
    process = CrawlerProcess(settings)
    process.crawl(RecentArticlesSpider, limit=1)
    process.start()

if __name__ == "__main__":
    run_spider()