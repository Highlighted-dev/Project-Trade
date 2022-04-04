from array import array
from asyncio.windows_events import NULL
import scrapy
from amazonscraper.items import AmazonscraperItem
import os
import pymongo
import json
from .. import GlobalVariables
class AmazonproductspiderSpider(scrapy.Spider):
    def __init__(self, consoleNumber, maxConsoleNumber):
        self.start_urls = GlobalVariables.start_urls[int(consoleNumber)*int(len(GlobalVariables.start_urls)/int(maxConsoleNumber)):(int(consoleNumber)+1)*int(len(GlobalVariables.start_urls)/int(maxConsoleNumber))]
        global pathToJson
        pathToJson = f'C:/Programowanie/Projekty/Project-Trade/amazonscraper/file{consoleNumber}.json'
        if os.path.exists(f"file{consoleNumber}.json"):
                os.remove(f"file{consoleNumber}.json")
    name = 'AmazonProductSpider'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        try:
            items = AmazonscraperItem()
            #Getting data from amazon
            prod_id = response.xpath('//div[@class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 sg-col s-widget-spacing-small sg-col-4-of-20"]/@data-asin').extract()
            title = response.xpath('//div[@class="a-section a-spacing-none a-spacing-top-small s-title-instructions-style"]//span[@class="a-size-base-plus a-color-base a-text-normal"]/text()').extract()
            sale_price = response.xpath('//div[@class="a-section a-spacing-none a-spacing-top-small s-price-instructions-style"]//span[@class="a-price-whole"]/text()').extract()
            prod_image = response.xpath('//div[@class="a-section aok-relative s-image-square-aspect"]//img[@class="s-image"]/@src').extract()

            for i in range(GlobalVariables.itemsPerPage):
                #Storing all data into items
                items['_id'] = ''.join(prod_id[i]).strip()
                items['product_name'] = ''.join(title[i]).strip()
                try:
                    items['product_sale_price'] = ''.join(sale_price[i]).strip()
                except:
                    items['product_sale_price'] = NULL
                items['product_image'] = ''.join(prod_image[i]).strip()
                yield items
        except Exception as e:
            print("Something went wrong when extracting items\n",e)
        #Get current amazon (ex. amazon.de)
        current_amazon = str(response.request.url).split("/-",1)[0]
        #Get next page URL
        next_page=current_amazon+"".join(response.xpath('//div[@class="a-section a-text-center s-pagination-container"]//a[@class="s-pagination-item s-pagination-next s-pagination-button s-pagination-separator"]/@href').extract())
        #If the page number equals maxPagesPerCategoryString, we don't want to go to the next page.
        if str(next_page[-2:len(next_page)]) != GlobalVariables.maxPagesPerCategoryString and str(next_page[-2:len(next_page)]) != "_"+GlobalVariables.maxPagesPerCategoryString:
            yield scrapy.Request(next_page, callback=self.parse)

    def closed(self, reason):
        #Send file.json to database when finished scraping
        assert os.path.isfile(pathToJson)
        myclient = pymongo.MongoClient(GlobalVariables.mongoUrl)
        mydb = myclient[GlobalVariables.mongoDatabase]
        mycol = mydb[GlobalVariables.mongoColumn]
        with open(pathToJson) as f:
            file_data = json.load(f)
        try:
            for obj in file_data:
                mycol.replace_one({"_id":obj["_id"]},obj,upsert=True)
            print("All products inserted to database successfully.")        
        except Exception as e:
            print("An error has occurred when trying to add products to database\n")
            print(e)

        
