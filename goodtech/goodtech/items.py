# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ArticleItem(scrapy.Item):
    titre = scrapy.Field()
    date_publication = scrapy.Field()
    contenu = scrapy.Field()
    thumbnail = scrapy.Field()
    images = scrapy.Field()
    tags = scrapy.Field()
    url = scrapy.Field()

class CategoryArticleItem(scrapy.Item):
    category = scrapy.Field()
    title = scrapy.Field()
    url = scrapy.Field()
    date = scrapy.Field()
    total_articles = scrapy.Field()  # Pour les statistiques
