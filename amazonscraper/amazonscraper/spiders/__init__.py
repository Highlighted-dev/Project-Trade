# This package will contain the spiders of your Scrapy project
#
# Please refer to the documentation for information on how to create and manage
# your spiders.
import scrapy
 
class AmazonItem(scrapy.Item):
  # define the fields for your item here like:
  product_name = scrapy.Field()
  product_sale_price = scrapy.Field()
  product_category = scrapy.Field()
  product_original_price = scrapy.Field()
  product_availability = scrapy.Field()