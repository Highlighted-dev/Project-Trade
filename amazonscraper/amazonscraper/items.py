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
class AmazonScraperOneItem(scrapy.Item):
  #_id=proudct_id | Name changed because mongodb was assigning default values for _id
  _id = scrapy.Field()
  product_name = scrapy.Field()
  product_sale_price = scrapy.Field()
  product_image = scrapy.Field()

