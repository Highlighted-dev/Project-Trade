import scrapy
from .. import GlobalVariables
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ..items import AmazonItemThumbImages, AmazonItemDetails, AmazonItemTechnicalDetails, AmazonItemAbout
from amazoncaptcha import AmazonCaptcha
import logging
from scrapy_splash import SplashFormRequest, SplashRequest
import pymongo
class AmazonOneProductSpider(scrapy.Spider):
    def __init__(self, prod_id):
        global product_id
        product_id = prod_id
        self.start_urls = ["https://www.amazon.de/-/en/dp/"+product_id]
        
        self.client = pymongo.MongoClient(GlobalVariables.mongo_url)
        self.db = self.client[GlobalVariables.mongo_db]
    #Change every request from ScrapyRequest to SplashRequest for javascript load
    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)
    name = 'AmazonOneProductSpider'
    allowed_domains = GlobalVariables.allowed_domains
    def parse(self, response):
        try:
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                images = AmazonItemThumbImages()
                details = AmazonItemDetails()
                technical_details = AmazonItemTechnicalDetails()
                abouts = AmazonItemAbout()

                #Getting data from amazon
                #product_name = response.xpath('//div[@id="titleSection"]//span[@id="productTitle"]/text()').extract()
                product_images = response.xpath('//div[@id="altImages"]//li[@class="a-spacing-small item imageThumbnail a-declarative"]//span[@class="a-button-text"]//img/@src').extract()
                product_details_name = response.xpath('//div[@id="productOverview_feature_div"]//table[@class="a-normal a-spacing-micro"]//td[@class="a-span3"]//span/text()').extract()                
                product_details = response.xpath('//div[@id="productOverview_feature_div"]//table[@class="a-normal a-spacing-micro"]//td[@class="a-span9"]//span/text()').extract()  
                product_technical_details_name = response.xpath('//div[@id="prodDetails"]//table[@id="productDetails_techSpec_section_1"]//th/text()').extract()
                product_technical_details = response.xpath('//div[@id="prodDetails"]//table[@id="productDetails_techSpec_section_1"]//td/text()').extract()

                for image in product_images:
                    images['product_id'] = product_id
                    images['product_thumb_image'] = image
                    self.db[GlobalVariables.mongo_column_thumb_images].replace_one({"product_id":images["product_id"],"product_thumb_image":images["product_thumb_image"]},images,upsert=True)
                    yield images
                #Sometimes there aren't any product details
                if len(product_details) < 1:
                    product_abouts = response.xpath('//div[@id="feature-bullets"]//ul[@class="a-unordered-list a-vertical a-spacing-mini"]//li[not(@id) and not(@class)]//span[@class="a-list-item"]/text()').extract()
                    for about in product_abouts:
                        abouts['product_id'] = product_id
                        abouts['product_about'] = about
                        self.db[GlobalVariables.mongo_column_about].replace_one({"product_id":abouts["product_id"],"product_about":abouts["product_about"]},abouts,upsert=True) 
                        yield abouts
                else:
                    for pdn,pd in zip(product_details_name,product_details):
                        #pd = productl_detail | pdn = product_detail_name
                        details['product_id'] = product_id
                        details['product_detail_name'] = pdn
                        details['product_detail'] = pd
                        self.db[GlobalVariables.mongo_column_details].replace_one({"product_id":details["product_id"],"product_detail_name":details["product_detail_name"]},details,upsert=True)
                        yield details

                #Sometimes there aren't any technical details
                if len(product_technical_details) < 1:
                    product_abouts = response.xpath('//div[@id="feature-bullets"]//ul[@class="a-unordered-list a-vertical a-spacing-mini"]//li[not(@id) and not(@class)]//span[@class="a-list-item"]/text()').extract()
                    for about in product_abouts:
                        abouts['product_id'] = product_id
                        abouts['product_about'] = about
                        self.db[GlobalVariables.mongo_column_about].replace_one({"product_id":abouts["product_id"],"product_about":abouts["product_about"]},abouts,upsert=True) 
                        yield abouts
                else:
                    for ptd,ptdn in zip(product_technical_details,product_technical_details_name):   
                        #ptd = product_techinal_detail | ptdn = product_technial_detail_name
                        technical_details['product_id'] = product_id
                        technical_details['product_technical_detail_name'] = "".join(ptdn).strip()
                        #Some technical details have ascii characters, we want to get rid of that
                        ptd_encode = ptd.encode("ascii","ignore")
                        ptd = ptd_encode.decode()
                        technical_details['product_technical_detail'] = "".join(ptd).strip()
                        self.db[GlobalVariables.mongo_column_technical_details].replace_one({"product_id":technical_details["product_id"],
                                                                                             "product_technical_detail_name":technical_details["product_technical_detail_name"]},
                                                                                             technical_details,upsert=True)
                        yield technical_details
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
        
