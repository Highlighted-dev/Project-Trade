# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AmazonscraperItem(scrapy.Item):
  product_id = scrapy.Field()
  product_name = scrapy.Field()
  product_sale_price = scrapy.Field()
  product_image = scrapy.Field()
class AmazonItemThumbImages(scrapy.Item):
  product_id = scrapy.Field()
  product_thumb_image = scrapy.Field()
class AmazonItemHighResImages(scrapy.Item):
  product_id = scrapy.Field()
  product_highres_image = scrapy.Field()
class AmazonItemDetails(scrapy.Item):
  product_id = scrapy.Field()
  product_detail_name = scrapy.Field()
  product_detail = scrapy.Field()
class AmazonItemTechnicalDetails(scrapy.Item):
  product_id = scrapy.Field()
  product_technical_detail_name = scrapy.Field()
  product_technical_detail = scrapy.Field()
class AmazonItemAbout(scrapy.Item):
  product_id = scrapy.Field()
  product_about = scrapy.Field()
class AmazonItemPrice(scrapy.Item):
  product_id = scrapy.Field()
  product_price = scrapy.Field()
  product_price_date = scrapy.Field()
class AmazonItemReviews(scrapy.Item):
  product_id = scrapy.Field()
  product_rating = scrapy.Field()
  product_rating_id = scrapy.Field()
  product_rating_date = scrapy.Field()



