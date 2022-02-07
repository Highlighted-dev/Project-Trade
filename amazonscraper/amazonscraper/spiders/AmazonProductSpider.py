from array import array
from asyncio.windows_events import NULL
import scrapy
from amazonscraper.items import AmazonscraperItem
import os
import pymongo
import json
from .. import globalvariables
class AmazonproductspiderSpider(scrapy.Spider):
    if os.path.exists("file.json"):
        os.remove("file.json")
    name = 'AmazonProductSpider'
    allowed_domains = globalvariables.allowed_domains 
    start_urls = globalvariables.start_urls
   
    def parse(self, response):
        items = AmazonscraperItem()
        #Getting data from amazon
        prod_id = response.xpath('//div[@class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 sg-col s-widget-spacing-small sg-col-4-of-20"]/@data-asin').extract()
        title = response.xpath('//div[@class="a-section a-spacing-none a-spacing-top-small s-title-instructions-style"]//span[@class="a-size-base-plus a-color-base a-text-normal"]/text()').extract()
        sale_price = response.xpath('//div[@class="a-section a-spacing-none a-spacing-top-small s-price-instructions-style"]//span[@class="a-price-whole"]/text()').extract()
        prod_image = response.xpath('//div[@class="a-section aok-relative s-image-square-aspect"]//img[@class="s-image"]/@src').extract()
        #27-3 = 24, [0,1,2..23]
        for i in range(len(title)- 3):
            #Storing all data into items
            items['_id'] = ''.join(prod_id[i]).strip()
            items['product_name'] = ''.join(title[i]).strip()
            try:
                items['product_sale_price'] = ''.join(sale_price[i]).strip()
            except:
                items['product_sale_price'] = NULL
            items['product_image'] = ''.join(prod_image[i]).strip()
            yield items
        #Get current amazon (ex. amazon.de)
        current_amazon = str(response.request.url).split("/-",1)[0]
        #Get next page URL
        next_page=current_amazon+"".join(response.xpath('//div[@class="a-section a-text-center s-pagination-container"]//a[@class="s-pagination-item s-pagination-next s-pagination-button s-pagination-separator"]/@href').extract())
        if str(next_page[-2:len(next_page)]) != globalvariables.maxPagesPerCategoryString:
            yield scrapy.Request(next_page, callback=self.parse)

    def closed(self, reason):
        #Send file.json to database when finished scraping
        path = globalvariables.pathToJson
        assert os.path.isfile(path)
        myclient = pymongo.MongoClient(globalvariables.mongoUrl)
        mydb = myclient[globalvariables.mongoDatabase]
        mycol = mydb[globalvariables.mongoColumn]
        with open(path) as f:
            file_data = json.load(f)
        #TODO change mongodb so it will skip same items. Right now if any item from json is in database "except" will show
        try:
            mycol.insert_many(file_data)
        except:
            print("Some items from file.json are already in database.")

        
