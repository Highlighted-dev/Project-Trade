import re
import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
from ..items import AmazonItemPrice
import logging
from scrapy_splash import SplashFormRequest
from datetime import date, datetime
import pymongo
from json import dumps
#TODO If you can buy used product instead of new, product prices will scrape the used one | Change to the new one price ex.https://www.amazon.de/dp/B09JQZ5DYM?th=1
class AmazonProductPrices(scrapy.Spider):
    def __init__(self, prod_id=None, fetch_prod_ids_from_db = False):
        self.start_urls = []
        self.insert_one_product_to_db = False
        self.client = pymongo.MongoClient(GlobalVariables.mongoUrl)
        self.db = self.client[GlobalVariables.mongoDatabase]
        #If we want to scrape only one product, we can this by passing the product id as an argument.
        if(prod_id):
            self.insert_one_product_to_db = True
            self.start_urls = ["https://www.amazon.de/-/en/dp/"+prod_id]
        elif(fetch_prod_ids_from_db):
            mongo_db_column_name = self.db[GlobalVariables.mongoColumn]
            prod_ids = mongo_db_column_name.find({}).distinct("product_id")
            if prod_ids:
                for prod_id in prod_ids:
                    self.start_urls.append("https://www.amazon.de/-/en/dp/"+prod_id)
        else:
            raise ValueError('No product id found')
                    
    name = 'AmazonProductPrices'
    allowed_domains = GlobalVariables.allowed_domains
    
    def parse(self, response):
        try:
            prices = AmazonItemPrice()
            self.product_id = self.getProductId(response)
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                current_price = response.xpath('//div[@id="corePrice_feature_div"]//span[@class="a-price aok-align-center"]//span[@class="a-offscreen"]/text()').extract()
                #Sometimes the are two prices: for used item, and for new item. We only want the new item price.
                if not current_price:
                    current_price = response.xpath('//div[@id="corePriceDisplay_desktop_feature_div"]//span[@class="a-price aok-align-center reinventPricePriceToPayMargin priceToPay"]//span[@class="a-offscreen"]/text()').extract_first()
                current_date = date.today()
                prices['product_id'] = self.product_id
                prices['product_price'] = re.sub(r"[\'\[\]\€]|\bname\b", '', str(current_price)) if current_price else None # remove "/", " ' " and "€" from current price with regex.
                prices['product_price_date'] = str(current_date)
                if not prices["product_price"]:
                    logging.warning("Unable to get price from url: %s", response.url)
                    # Get the last price from the database
                    last_price = list(self.db[GlobalVariables.mongo_column_prices]
                                      .find({"product_id":prices["product_id"]})
                                      .sort("product_price_date", pymongo.DESCENDING)
                                      .limit(1))[0] 
                    #! Sometimes the price is not available, so we need to get the price from the previous day/days and make it as current price
                    prices["product_price"] = last_price["product_price"]
                if(self.insert_one_product_to_db):
                    self.db[GlobalVariables.mongo_column_prices].insert_one(dict(prices))
                yield prices
        except Exception as e:
            logging.error("Something went wrong while extracting items\n")
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
            yield scrapy.FormRequest.from_response(response,
                                        formdata={'field-keywords': captcha_solution},
                                        callback=origin_method)
        except Exception as e:
            logging.error("Something went wrong while solving captcha\n")
            logging.error(e)
            return None
        
