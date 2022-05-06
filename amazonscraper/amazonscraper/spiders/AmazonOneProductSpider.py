import scrapy
from .. import GlobalVariables
import os
from amazonscraper.items import AmazonScraperOneItem
from amazoncaptcha import AmazonCaptcha
import logging
class AmazonOneProductSpider(scrapy.Spider):
    def __init__(self, product_id):
        self.start_urls = ["https://www.amazon.de/-/en/dp/"+product_id]
    name = 'AmazonOneProductSpider'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        try:
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                items = AmazonScraperOneItem()
                #Getting data from amazon
                product_name = response.xpath('//div[@id="titleSection"]//span[@id="productTitle"]/text()').extract()
                product_image = response.xpath('//div[id="altImages"]//li[@class="a-spacing-small item imageThumbnail a-declarative"]//span[@class="a-button-text"]/img/@src').extract()
                print(product_image)
                items['product_name'] = "".join(product_name).strip()
                yield items
        except Exception as e:
            print("Something went wrong when extracting items\n",e)

    def checkForCaptcha(self, response):
        captcha_url = response.xpath('//div[@class="a-row a-text-center"]/img/@src').extract_first()

        if captcha_url:
            logging.log(logging.INFO, 'PAGE {} GOT BY CAPTCHA!'.format(response.request.url))
            return True
        else:
            return False
    def solveCaptcha(self, response, origin_method):
        logging.log(logging.INFO, "Trying to solve captcha...")
        try:
            captcha_url = response.xpath('//div[@class="a-row a-text-center"]/img/@src').extract_first()
            captcha = AmazonCaptcha.fromlink(captcha_url)
            captcha_solution = captcha.solve()
            logging.log(logging.INFO, "Captcha solved!")
            yield scrapy.FormRequest.from_response(response,
                                        formdata={'field-keywords': captcha_solution},
                                        callback=origin_method)
        except Exception as e:
            print("Something went wrong while solving captcha\n",e)
            return None