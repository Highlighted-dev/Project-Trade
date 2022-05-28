import scrapy
from .. import GlobalVariables
from amazonscraper.items import AmazonItemImages, AmazonItemDetails, AmazonItemTechnicalDetails, AmazonItemAbout
from amazoncaptcha import AmazonCaptcha
import logging
from scrapy_splash import SplashFormRequest, SplashRequest

class AmazonGetAllImages(scrapy.Spider):
    def __init__(self, prod_id):
        global product_id
        product_id = prod_id
        self.start_urls = ["https://www.amazon.de/-/en/dp/"+product_id]
    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)
    name = 'AmazonGetAllImages'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        try:
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:

                #Getting data from amazon
                #product_name = response.xpath('//div[@id="titleSection"]//span[@id="productTitle"]/text()').extract()
                product_images = response.xpath('//div[@id="altImages"]//li[@class="a-spacing-small item imageThumbnail a-declarative"]//span[@class="a-button-text"]//img/@src').extract()
                product_big_images = response.xpath('//script/text()').re(".*'colorImages'.*")
                logging.info(product_big_images)

                #Formatting string with regular expression. "(.*?)" means "anything"
                # format_product_big_images_string  = re.findall(r'"(.*?)"', product_big_images)
                # for x in format_product_big_images_string:
                #     logging.info(x)
                # for image in product_images:
                #     images['product_id'] = product_id
                #     images['product_image'] = image
                #     images['mongo_db_column_name'] = GlobalVariables.mongo_column_images
                #     yield images
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
        
