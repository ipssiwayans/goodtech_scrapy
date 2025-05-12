import scrapy
from goodtech.items import CategoryArticleItem
from urllib.parse import urlparse


class CategoriesSpider(scrapy.Spider):
    name = "categories"
    allowed_domains = ["goodtech.info"]

    start_urls = [
        "https://goodtech.info/developpement/",
        "https://goodtech.info/applications/",
        "https://goodtech.info/materiel/",
        "https://goodtech.info/tribunes-et-opinions/",
        "https://goodtech.info/agenda/",
        "https://goodtech.info/goodtech/",
    ]

    def __init__(self, limit=0, *args, **kwargs):
        super(CategoriesSpider, self).__init__(*args, **kwargs)
        self.limit = int(limit)
        self.category_total_counts = {}  # pour le volume total

    def parse(self, response):
        path_parts = urlparse(response.url).path.strip("/").split("/")

        # Identifier le nom de la catégorie et le numéro de page
        if "page" in path_parts:
            category_name = path_parts[path_parts.index("page") - 1]
            current_page = int(path_parts[-1])
        else:
            category_name = path_parts[-1]
            current_page = 1

        # Initialiser le compteur pour la catégorie si nécessaire
        if category_name not in self.category_total_counts:
            self.category_total_counts[category_name] = 0

        # Vérifier si on a dépassé la limite de pages
        if self.limit > 0 and current_page > self.limit:
            self.logger.info(
                f"Limite de {self.limit} pages atteinte pour la catégorie {category_name}"
            )
            return

        for article in response.css("article.uagb-post__inner-wrap"):
            self.category_total_counts[category_name] += 1

            item = CategoryArticleItem()
            item["category"] = category_name
            item["title"] = article.css("h4.uagb-post__title a::text").get()
            item["url"] = article.css("h4.uagb-post__title a::attr(href)").get()
            item["date"] = article.css("time::attr(datetime)").get()
            item["total_articles"] = self.category_total_counts[category_name]
            yield item

        # Suivre le lien de la page suivante si on n'a pas atteint la limite
        next_page = response.css("a.page-numbers.next::attr(href)").get()
        if next_page:
            # Vérifier la limite avant de suivre la page suivante
            if self.limit == 0 or current_page < self.limit:
                yield response.follow(next_page, callback=self.parse)
            else:
                self.logger.info(
                    f"Ne pas suivre la page suivante car limite de {self.limit} pages atteinte pour {category_name}"
                )

    def closed(self, reason):
        # Affiche les volumes par catégorie une fois le spider terminé
        self.logger.info("=== Volume total d'articles par catégorie ===")
        for cat, count in self.category_total_counts.items():
            self.logger.info(f"{cat}: {count} articles")
