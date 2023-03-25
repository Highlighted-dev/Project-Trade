import json
import os
from pathlib import Path
import re
import scrapy
from datetime import date
import logging
import pymongo
from scrapy_splash import SplashFormRequest, SplashRequest

from .. import GlobalVariables
from ..items import AmazonItemPrice
from amazoncaptcha import AmazonCaptcha
#TODO If you can buy used product instead of new, product prices will scrape the used one | Change to the new one price ex.https://www.amazon.de/dp/B09JQZ5DYM?th=1
class AmazonProductPrices(scrapy.Spider):
    name = 'AmazonProductPrices'
    allowed_domains = GlobalVariables.allowed_domains

    def __init__(self, prod_id=None, fetch_prod_ids_from_db = False):
        self.start_urls = []
        self.client = pymongo.MongoClient(GlobalVariables.mongoUrl)
        self.db = self.client[GlobalVariables.mongoDatabase]
        #If we want to scrape only one product, we can this by passing the product id as an argument.
        if(prod_id):
            self.start_urls = ["https://www.amazon.de/-/en/dp/"+prod_id]
        elif(fetch_prod_ids_from_db):
            mongo_db_column_name = self.db[GlobalVariables.mongoColumn]
            prod_ids = mongo_db_column_name.find({}).distinct("product_id")
            if prod_ids:
                for prod_id in prod_ids:
                    self.start_urls.append("https://www.amazon.de/-/en/dp/"+prod_id)
        else:
            raise ValueError('No product id found')
                    
    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)

    def parse(self, response):
        try:
            prices = AmazonItemPrice()
            self.product_id = self.getProductId(response)
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                current_price = response.xpath('//div[@id="corePrice_feature_div"]//span[@class="a-price aok-align-center"]//span[@class="a-offscreen"]/text()').extract()
                if not current_price:
                    current_price = response.xpath('//div[@id="corePriceDisplay_desktop_feature_div"]//span[@class="a-price aok-align-center reinventPricePriceToPayMargin priceToPay"]//span[@class="a-offscreen"]/text()').extract_first()
                current_date = date.today()
                prices['product_id'] = self.product_id
                prices['product_price'] = re.sub(r"[\'\[\]\€]|\bname\b", '', str(current_price)) if current_price else None
                prices['product_price_date'] = str(current_date)
                if not prices["product_price"]:
                    logging.warning("Unable to get price from url: %s", response.url)
                    last_price = list(self.db[GlobalVariables.mongo_column_prices].find({"product_id": prices["product_id"]}).sort("product_price_date", pymongo.DESCENDING).limit(1))[0]
                    prices["product_price"] = last_price["product_price"]
                yield prices
        except Exception as e:
            logging.error("Something went wrong while extracting items")
            logging.error(e)  

    def getProductId(self, response):
        try:
            return response.url.split("/dp/")[1].split("/")[0]
        except IndexError:
            logging.warning("Unable to get product id from url: %s", response.url)
            return "None"
        
    def checkForCaptcha(self, response):
        captcha_url = response.xpath('//div[@class="a-row a-text-center"]/img/@src').extract_first()

        if captcha_url:
            logging.info('Found captcha on page!')
            return True
        else:
            return False
    
    def solveCaptcha(self, response, origin_method):
        logging.info("Trying to solve captcha...")
        try:
            # Get the captcha image url from website
            captcha_url = response.xpath('//div[@class="a-row a-text-center"]/img/@src').extract_first()
            # Solve Captcha with AmazonCaptcha
            captcha = AmazonCaptcha.fromlink(captcha_url)
            captcha_solution = captcha.solve()
            logging.info("Captcha solved!")
            yield SplashFormRequest.from_response(response,
                                        formdata={'field-keywords': captcha_solution},
                                        callback=origin_method)
        except Exception as e:
            logging.error("Something went wrong while solving captcha\n")
            logging.error(e)
            return None
    
    def closed(self, reason):
        pathToJson = (str(Path(__file__).parents[2])+f'/AmazonPrices.json').replace(os.sep, '/')
        with open(pathToJson) as f:
            file_data = json.load(f)
        bulk_operations = [pymongo.ReplaceOne(filter=({"product_id":item["product_id"],"product_price_date":item["product_price_date"]}),replacement=item,upsert=True) for item in file_data]
        self.db[GlobalVariables.mongo_column_prices].bulk_write(bulk_operations)
        os.remove(pathToJson)
        
