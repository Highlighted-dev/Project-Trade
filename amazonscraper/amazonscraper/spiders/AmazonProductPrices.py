import re
import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
from amazonscraper.items import AmazonItemPrice
import logging
from scrapy_splash import SplashFormRequest
from datetime import date
class AmazonProductPrices(scrapy.Spider):
    def __init__(self, prod_id):
        self.product_id = prod_id
        self.start_urls = ["https://www.amazon.de/-/en/dp/"+self.product_id]
    name = 'AmazonProductPrices'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        prices = AmazonItemPrice()
        try:
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                current_price = response.xpath('//div[@id="corePrice_feature_div"]//span[@class="a-price aok-align-center"]//span[@class="a-offscreen"]/text()').extract()
                current_date = date.today()
                prices['product_id'] = self.product_id
                prices['product_price'] = re.sub(r"[\'\[\]]|\bname\b", '', str(current_price))  # remove " / " and " ' " from current price with regex.
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
            captcha_url = response.xpath('//div[@class="a-row a-text-center"]/img/@src').extract_first()
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
        