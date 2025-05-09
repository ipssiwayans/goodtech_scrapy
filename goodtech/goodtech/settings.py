BOT_NAME = "goodtech"

SPIDER_MODULES = ["goodtech.spiders"]
NEWSPIDER_MODULE = "goodtech.spiders"

ADDONS = {}
MONGO_URI = "mongodb://localhost:27017/"
MONGO_DATABASE = "goodtech"

ITEM_PIPELINES = {
    'goodtech.pipelines.GoodtechPipeline': 300,
}

# Obey robots.txt rules
ROBOTSTXT_OBEY = True
FEED_EXPORT_ENCODING = "utf-8"

DOWNLOAD_DELAY = 2