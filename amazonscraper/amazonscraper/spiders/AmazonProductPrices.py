import re
import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
from ..items import AmazonItemPrice
import logging
from scrapy_splash import SplashFormRequest
from datetime import date
import pymongo

#TODO If you can buy used product instead of new, product prices will scrape the used one | Change to the new one price ex.https://www.amazon.de/dp/B09JQZ5DYM?th=1
class AmazonProductPrices(scrapy.Spider):
    def __init__(self, prod_id=None, fetch_prod_ids_from_db = False):
        self.start_urls = []
        #If we want to scrape only one product, we can this by passing the product id as an argument.
        if(prod_id):
            self.start_urls = ["https://www.amazon.de/-/en/dp/"+prod_id]
        elif(fetch_prod_ids_from_db):
            client = pymongo.MongoClient(GlobalVariables.mongoUrl)
            db = client[GlobalVariables.mongoDatabase]
            mongo_db_column_name = db[GlobalVariables.mongoColumn]
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
            self.product_id = response.url.split('https://www.amazon.de/-/en/dp/')[1]
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
                prices['mongo_db_column_name'] = GlobalVariables.mongo_column_prices
                yield prices
        except Exception as e:
            logging.error("Something went wrong while extracting items\n")
            logging.error(e)      

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
        
