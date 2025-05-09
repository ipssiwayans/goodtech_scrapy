class GoodtechPipeline:
    def process_item(self, item, spider):
        return item


from itemadapter import ItemAdapter
import pymongo
from scrapy.exceptions import DropItem


class GoodtechPipeline:
    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.client = None
        self.db = None

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI', 'mongodb://localhost:27017'),
            mongo_db=crawler.settings.get('MONGO_DATABASE', 'goodtech')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        try:
            if spider.name == "article_detail":
                # Traiter les articles complets
                collection = "articles"
                existing = self.db[collection].find_one({'url': item['url']})
                if existing:
                    # Mettre à jour l'article existant
                    self.db[collection].update_one(
                        {'url': item['url']},
                        {'$set': ItemAdapter(item).asdict()}
                    )
                else:
                    # Insérer un nouvel article
                    self.db[collection].insert_one(ItemAdapter(item).asdict())
            
            elif spider.name == "recent_articles":
                # Traiter les articles récents
                collection = "recent_articles"
                self.db[collection].update_one(
                    {"url": item["url"]}, 
                    {"$set": dict(item)}, 
                    upsert=True
                )
            return item
        except Exception as e:
            raise DropItem(f"Erreur lors de l'insertion/mise à jour de l'item : {e}")
