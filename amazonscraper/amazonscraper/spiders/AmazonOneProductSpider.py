import scrapy
from .. import GlobalVariables
import os
from amazonscraper.items import AmazonItemImages, AmazonItemDetails, AmazonItemTechnicalDetails
from amazoncaptcha import AmazonCaptcha
import logging
from scrapy_splash import SplashFormRequest
import pymongo
import json
class AmazonOneProductSpider(scrapy.Spider):
    def __init__(self, prod_id):
        global product_id
        product_id = prod_id
        self.start_urls = ["https://www.amazon.de/-/en/dp/"+product_id]
    name = 'AmazonOneProductSpider'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        try:
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                images = AmazonItemImages()
                details = AmazonItemDetails()
                technical_details = AmazonItemTechnicalDetails()
                #Getting data from amazon
                #product_name = response.xpath('//div[@id="titleSection"]//span[@id="productTitle"]/text()').extract()
                product_images = response.xpath('//div[@id="altImages"]//li[@class="a-spacing-small item imageThumbnail a-declarative"]//span[@class="a-button-text"]//img/@src').extract()
                product_details_name = response.xpath('//div[@id="productOverview_feature_div"]//table[@class="a-normal a-spacing-micro"]//td[@class="a-span3"]//span/text()').extract()                
                product_details = response.xpath('//div[@id="productOverview_feature_div"]//table[@class="a-normal a-spacing-micro"]//td[@class="a-span9"]//span/text()').extract()  
                product_technical_details_name = response.xpath('//div[@id="prodDetails"]//table[@id="productDetails_techSpec_section_1"]//th/text()').extract()
                product_technical_details = response.xpath('//div[@id="prodDetails"]//table[@id="productDetails_techSpec_section_1"]//td/text()').extract()

                for image in product_images:
                    images['product_id'] = product_id
                    images['product_image'] = image
                    images['mongo_db_column_name'] = GlobalVariables.mongo_column_images
                    yield images
                for pdn,pd in zip(product_details_name,product_details):
                    #pd = productl_detail | pdn = product_detail_name
                    details['product_id'] = product_id
                    details['product_detail_name'] = pdn
                    details['product_detail'] = pd
                    details['mongo_db_column_name'] = GlobalVariables.mongo_column_details
                    yield details
                for ptd,ptdn in zip(product_technical_details,product_technical_details_name):   
                    #ptd = product_techinal_detail | ptdn = product_technial_detail_name
                    technical_details['product_id'] = product_id
                    technical_details['product_technical_detail_name'] = "".join(ptdn).strip()
                    ptd_encode = ptd.encode("ascii","ignore")
                    ptd = ptd_encode.decode()
                    technical_details['product_technical_detail'] = "".join(ptd).strip()
                    technical_details['mongo_db_column_name'] = GlobalVariables.mongo_column_technical_details
                    yield technical_details
                # yield items
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
        logging.log(logging.INFO, "Trying to solve captcha...")
        try:
            captcha_url = response.xpath('//div[@class="a-row a-text-center"]/img/@src').extract_first()
            captcha = AmazonCaptcha.fromlink(captcha_url)
            captcha_solution = captcha.solve()
            logging.log(logging.INFO, "Captcha solved!")
            yield SplashFormRequest.from_response(response,
                                        formdata={'field-keywords': captcha_solution},
                                        callback=origin_method)
        except Exception as e:
            logging.error("Something went wrong while solving captcha\n")
            logging.error(e)
            return None
        
