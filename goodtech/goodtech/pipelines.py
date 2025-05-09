class GoodtechPipeline:
    def process_item(self, item, spider):
        return item


import pymongo
from scrapy.exceptions import DropItem


class MongodbPipeline:
    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.client = None
        self.db = None

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get("MONGO_URI", "mongodb://localhost:27017/"),
            mongo_db=crawler.settings.get("MONGO_DATABASE", "goodtech"),
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        try:
            self.db["recent_articles"].update_one(
                {"url": item["url"]}, {"$set": dict(item)}, upsert=True
            )
            return item
        except Exception as e:
            raise DropItem(f"Erreur lors de l'insertion/mise à jour de l'item : {e}")
