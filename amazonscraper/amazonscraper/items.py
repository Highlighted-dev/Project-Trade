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
  mongo_db_column_name = scrapy.Field()
class AmazonItemThumbImages(scrapy.Item):
  mongo_db_column_name = scrapy.Field()
  product_id = scrapy.Field()
  product_thumb_image = scrapy.Field()
class AmazonItemHighResImages(scrapy.Item):
  mongo_db_column_name = scrapy.Field()
  product_id = scrapy.Field()
  product_highres_image = scrapy.Field()
class AmazonItemDetails(scrapy.Item):
  mongo_db_column_name = scrapy.Field()
  product_id = scrapy.Field()
  product_detail_name = scrapy.Field()
  product_detail = scrapy.Field()
class AmazonItemTechnicalDetails(scrapy.Item):
  mongo_db_column_name = scrapy.Field()
  product_id = scrapy.Field()
  product_technical_detail_name = scrapy.Field()
  product_technical_detail = scrapy.Field()
class AmazonItemAbout(scrapy.Item):
  mongo_db_column_name = scrapy.Field()
  product_id = scrapy.Field()
  product_about = scrapy.Field()



