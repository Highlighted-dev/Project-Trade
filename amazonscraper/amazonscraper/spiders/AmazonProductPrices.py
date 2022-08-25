import re
import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
from ..items import AmazonItemPrice
import logging
from scrapy_splash import SplashFormRequest
from datetime import date
class AmazonProductPrices(scrapy.Spider):
    def __init__(self, prod_id=None, string_of_many_prod_ids=None):
        self.start_urls = []
        #If we want to scrape only one product, we can this by passing the product id as an argument.
        if(prod_id):
            self.product_id = prod_id
            self.start_urls = ["https://www.amazon.de/-/en/dp/"+self.product_id]
        # If we want to scrape many products at once, we need to pass a string of many product ids.
        elif(string_of_many_prod_ids):
            #Split the string of many product ids into a list of product ids.
            #Example string_of_many_prod_ids: "B074QQQQQQ,B074QQQQQQ,B074QQQQQQ"
            #Product_id_array after split: ["B074QQQQQQ", "B074QQQQQQ", "B074QQQQQQ"]
            prod_id_array = string_of_many_prod_ids.split(',')
            if prod_id_array:
                for prod_id in prod_id_array:
                    self.product_id = prod_id
                    self.start_urls.append("https://www.amazon.de/-/en/dp/"+self.product_id)
            else:
                raise ValueError("No product ids found in array")
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
                prices['product_price'] = re.sub(r"[\'\[\]\€]|\bname\b", '', str(current_price))  # remove "/", " ' " and "€" from current price with regex.
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
            yield SplashFormRequest.from_response(response,
                                        formdata={'field-keywords': captcha_solution},
                                        callback=origin_method)
        except Exception as e:
            logging.error("Something went wrong while solving captcha\n")
            logging.error(e)
            return None
        
