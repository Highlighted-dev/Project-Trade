# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AmazonscraperItem(scrapy.Item):
  #_id=proudct_id | Name changed because mongodb was assigning default values for _id
  _id = scrapy.Field()
  product_name = scrapy.Field()
  product_sale_price = scrapy.Field()
  product_image = scrapy.Field()
  mongo_db_column_name = scrapy.Field()
class AmazonItemImages(scrapy.Item):
  mongo_db_column_name = scrapy.Field()
  product_id = scrapy.Field()
  product_image_thumb = scrapy.Field()
  product_image_highres = scrapy.Field()
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



