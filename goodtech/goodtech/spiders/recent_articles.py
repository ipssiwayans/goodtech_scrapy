import scrapy
from datetime import datetime


class RecentArticlesSpider(scrapy.Spider):
    name = "recent_articles"
    allowed_domains = ["goodtech.info"]
    start_urls = ["https://goodtech.info/"]

    def __init__(self, limit=0, *args, **kwargs):
        super(RecentArticlesSpider, self).__init__(*args, **kwargs)
        self.limit = int(limit)
        self.page_count = 1

    def parse(self, response):
        section = response.css("div.wp-block-uagb-container.uagb-block-7858914e")

        for article in section.css("article.uagb-post__inner-wrap"):
            image_url = article.css("div.uagb-post__image img::attr(src)").get(
                default="Image non trouvée"
            )
            date_str = article.css("time.uagb-post__date::attr(datetime)").get()
            date = (
                datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                if date_str
                else None
            )
            yield {
                "title": article.css("h5.uagb-post__title a::text")
                .get(default="Titre non trouvé")
                .strip(),
                "url": response.urljoin(
                    article.css("h5.uagb-post__title a::attr(href)").get(default="")
                ),
                "date": date,
                "summary": article.css("div.uagb-post__excerpt p::text")
                .get(default="Résumé non disponible")
                .strip(),
                "thumbnail_url": (
                    response.urljoin(image_url)
                    if image_url != "Image non trouvée"
                    else "Image non trouvée"
                ),
            }

        if self.limit == 0 or self.page_count < self.limit:
            next_page = section.css("a.next.page-numbers::attr(href)").get()
            if next_page:
                self.page_count += 1
                yield response.follow(next_page, callback=self.parse)
