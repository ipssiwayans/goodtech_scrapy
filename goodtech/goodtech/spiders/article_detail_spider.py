import scrapy
import re
from datetime import datetime
import unicodedata
from goodtech.items import ArticleItem

class ArticleDetailSpider(scrapy.Spider):
    name = "article_detail"
    allowed_domains = ["goodtech.info"]
    start_urls = ["https://goodtech.info/tous-les-articles/"]
    
    def __init__(self, urls=None, limit=0, *args, **kwargs):
        super(ArticleDetailSpider, self).__init__(*args, **kwargs)
        self.limit = int(limit)
        self.page_count = 1
        self.processed_urls = set()
        self.parse_direct_urls = False
        if urls:
            self.start_urls = urls.split(',')
            self.parse_direct_urls = True
    
    def normalize_text(self, text):
        """Normalise un texte en supprimant les accents et en le mettant en minuscules."""
        text = unicodedata.normalize('NFKD', text)
        text = ''.join([c for c in text if not unicodedata.combining(c)])
        return text.lower()
    
    def parse(self, response):
        """
        Méthode principale pour extraire les URLs des articles.
        S'inspire de la méthode utilisée dans recent_articles.py
        """
        if self.parse_direct_urls:
            yield self.parse_article(response)
            return
        
        article_urls = set()
        
        title_links = response.css("h4.uagb-post__title a::attr(href)").getall()
        for url in title_links:
            if url and url not in self.processed_urls:
                article_urls.add(url)
        
        read_more_links = response.css("a.uagb-text-link::attr(href), a.wp-block-button__link::attr(href), a:contains('Lire la suite')::attr(href)").getall()
        for url in read_more_links:
            if url and url not in self.processed_urls and url not in article_urls:
                article_urls.add(url)
        
        image_links = response.css("div.uagb-post__image a::attr(href), article .uagb-post__image a::attr(href)").getall()
        for url in image_links:
            if url and url not in self.processed_urls and url not in article_urls:
                article_urls.add(url)
        
        articles = response.css("article.uagb-post__inner-wrap")
        for article in articles:
            links = article.css("a::attr(href)").getall()
            for url in links:
                if url and url not in self.processed_urls and url not in article_urls:
                    if '/page/' not in url and not url.endswith('#') and '/category/' not in url and '/tag/' not in url:
                        article_urls.add(url)
        
        article_urls = list(article_urls)
        
        article_urls = [url for url in article_urls if 
                        'goodtech.info' in url and 
                        '/page/' not in url and 
                        not url.endswith('#') and 
                        '/category/' not in url and 
                        '/tag/' not in url]
        
        for i, url in enumerate(article_urls, 1):
            self.processed_urls.add(url)
            yield response.follow(url, callback=self.parse_article)
        
        if self.limit == 0 or self.page_count < self.limit:
            pagination_selectors = [
                "a.next.page-numbers::attr(href)",
                "a:contains('Après')::attr(href)",
                "div.uagb-post-pagination-wrap a:last-child::attr(href)",
                "//a[contains(text(), 'Après')]/@href",  # XPath
                "//div[contains(@class, 'pagination')]/a[last()]/@href",  # XPath
            ]
            
            for selector in pagination_selectors:
                if selector.startswith("//"):
                    next_page = response.xpath(selector).get()
                else:
                    next_page = response.css(selector).get()
                
                if next_page:
                    self.page_count += 1
                    yield response.follow(next_page, callback=self.parse)
                    break
    
    def parse_article(self, response):
        """Extraction des détails d'un article."""
        article = ArticleItem()
        
        article['titre'] = response.css('h1.entry-title::text').get().strip()
        
        date_iso = response.css('time.uagb-post__date::attr(datetime)').get()
        if date_iso:
            try:
                date_obj = datetime.fromisoformat(date_iso)
                article['date_publication'] = date_obj.strftime('%Y-%m-%d')
            except (ValueError, AttributeError):
                article['date_publication'] = "Format de date invalide"

        else:
            date_text = response.css('span.published::text').get()
            if date_text:
                date_text = date_text.strip()
                try:
                    jour, mois, annee = date_text.split('/')
                    article['date_publication'] = f"{annee.strip()}-{mois.strip()}-{jour.strip()}"
                except Exception:
                    article['date_publication'] = date_text
            
            else:
                for selector in ['time.entry-date.published::text', '.entry-meta .posted-on time::text', 
                                '.posted-on a time::text', '.posted-on time::text']:
                    date_text = response.css(selector).get()
                    if date_text:
                        date_text = date_text.strip()
                        break
                
                if not date_text:
                    date_xpath = response.xpath('//span[contains(@class, "posted-on")]/text()').get()
                    if date_xpath:
                        date_text = date_xpath.strip()
                
                if date_text:
                    try:
                        mots = date_text.split()
                        if len(mots) >= 3:
                            jour, mois, annee = mots[0], mots[1], mots[2]
                            mois_map = {
                                'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04', 
                                'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08', 
                                'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
                            }
                            mois_num = mois_map.get(mois.lower(), '01')
                            jour_formatte = jour.zfill(2) if len(jour) == 1 else jour
                            article['date_publication'] = f"{annee}-{mois_num}-{jour_formatte}"
                        else:
                            article['date_publication'] = date_text
                    except Exception:
                        article['date_publication'] = date_text
                else:
                    article['date_publication'] = "Date non spécifiée"
        
        contenu_elements = response.css('div.entry-content p, div.entry-content h2, div.entry-content h3, div.entry-content h4, div.entry-content ul li')
        contenu = []
        for element in contenu_elements:
            text = element.css('::text').getall()
            text = ''.join(text).strip()
            if text:
                contenu.append(text)
        
        article['contenu'] = '\n\n'.join(contenu)
        
        article['thumbnail'] = response.css('div.post-thumb-img-content img::attr(src), .wp-post-image::attr(src), article .entry-header img::attr(src)').get() or ""
        
        content_images = response.css('div.entry-content img::attr(src)').getall()
        images = {}
        
        thumbnail_url = article['thumbnail']
        if thumbnail_url:
            images[thumbnail_url] = {"type": "thumbnail", "url": thumbnail_url}
        
        for idx, img_url in enumerate(content_images):
            if img_url not in images:
                images[img_url] = {"type": "content", "url": img_url, "position": idx}
        
        article['images'] = list(images.values())
        
        all_tags = []
        all_tags.extend(response.css('span.tags-links a::text, footer.entry-footer a[rel="tag"]::text').getall())
        all_tags.extend([cat for cat in response.css('.breadcrumb a::text, .breadcrumbs a::text').getall() if cat.strip() != 'Accueil'])
        all_tags.extend(response.css('.cat-links a::text, .entry-footer .category-links a::text, .entry-meta .category a::text').getall())
        
        unique_tags = []
        seen = set()
        for tag in all_tags:
            tag = tag.strip()
            if tag:
                normalized_tag = self.normalize_text(tag)
                if normalized_tag not in seen:
                    seen.add(normalized_tag)
                    unique_tags.append(tag)
        
        article['tags'] = unique_tags
        
        article['url'] = response.url
        
        return article 