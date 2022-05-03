import scrapy
from sqlalchemy import null
from .. import GlobalVariables
import os
from amazonscraper.items import AmazonScraperOneItem
class AmazonOneProductSpider(scrapy.Spider):
    def __init__(self, product_id):
        self.start_urls = ["https://www.amazon.de/-/en/dp/"+product_id]
    name = 'AmazonOneProductSpider'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        try:
            items = AmazonScraperOneItem()
            #Getting data from amazon
            productName = response.xpath('//div[@id="titleSection"]//span[@id="productTitle"]/text()').extract()
            items['product_name'] = "".join(productName).strip()
            print(productName)
            yield items
        except Exception as e:
            print("Something went wrong when extracting items\n",e)