import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
import logging
from scrapy_splash import SplashFormRequest, SplashRequest
import re
class AmazonGetHighResImages(scrapy.Spider):
    def __init__(self, prod_id):
        global product_id
        product_id = prod_id
        self.start_urls = ["https://www.amazon.de/-/en/dp/"+product_id]
    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)
    name = 'AmazonGetHighResImages'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        try:
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:

                #Getting data from amazon  
                product_highres_images = str(response.xpath('//script/text()').re(".*'colorImages'.*"))
                #Format string product_highres_images with regular expression
                #Example input:  { \'initial\': [{"hiRes":"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SL1500_.jpg","thumb":"https://m.media-amazon.com/images/I/41yJ1Hn4ZGL._AC_US40_.jpg","large":"https://m.media-amazon.com/images/I/41yJ1Hn4ZGL._AC_.jpg","main":{"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SY355_.jpg":[355,355],"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SY450_.jpg":[450,450],"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SX425_.jpg":[425,425],"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SX466_.jpg":[466,466],"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SX522_.jpg":[522,522],"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SX569_.jpg":[569,569],"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SX679_.jpg":[679,679]},"variant":"MAIN","lowRes":null,"shoppableScene":null}]}
                #Example output: https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SL1500_.jpg
                format_product_big_images_string  = re.findall(r'"hiRes":"(.*?)"', product_highres_images)
                for x in format_product_big_images_string:
                    logging.info(x)
    
                # for x in format_product_big_images_string:
                #     logging.info(x)

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
        