import datetime
from itertools import product
import re
import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
from ..items import AmazonItemReviews
import logging
from scrapy_splash import SplashFormRequest
from datetime import datetime
import pymongo
class AmazonReviewsSpider(scrapy.Spider):
    def __init__(self, prod_id = None,fetch_prod_ids_from_db = False):
        self.start_urls = []
        client = pymongo.MongoClient(GlobalVariables.mongoUrl)
        db = client[GlobalVariables.mongoDatabase]
        #If we want to scrape only one product, we can this by passing the product id as an argument.
        if(prod_id):
            self.product_id = prod_id
            self.start_urls = [f"https://www.amazon.de/-/en/product-reviews/{self.product_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent",f"https://www.amazon.de/-/en/product-reviews/{self.product_id}/ref=cm_cr_arp_d_paging_btm_next_5?sortBy=recent&pageNumber=5"]              
            column = db[GlobalVariables.mongo_column_reviews]
            column.delete_many({"product_id":self.product_id})
            client.close()
            logging.info("Successfully removed old data for product with id: " + self.product_id)
        elif(fetch_prod_ids_from_db):
            mongdo_product_column = db[GlobalVariables.mongoColumn]
            mongo_column_reviews =  db[GlobalVariables.mongo_column_reviews]
            prod_ids = mongdo_product_column.find({}).distinct("product_id")
            if prod_ids:
                for prod_id in prod_ids:
                    self.start_urls.append(f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent")
                    self.start_urls.append(f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_paging_btm_next_5?sortBy=recent&pageNumber=5")
                    mongo_column_reviews.delete_many({"product_id":prod_id})
            client.close()
        else:
            raise ValueError("You must pass either a product id or set fetch_prod_ids_from_db=True")
    name = 'AmazonReviewsSpider'
    allowed_domains = GlobalVariables.allowed_domains

    def parse(self, response):
        try:
            amazon_reviews = AmazonItemReviews()
            self.product_id = response.url.split('https://www.amazon.de/-/en/product-reviews/')[1].split('/ref=')[0]
            logging.info("Extracting items from product with id: " + self.product_id)
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                product_rating = response.xpath('//div[@id="cm_cr-review_list"]//div[@class="a-section celwidget"]//div[@class="a-row"]//span[@class="a-icon-alt"]/text()').extract()
                product_rating_id = response.xpath('//div[@class="a-section a-spacing-none reviews-content a-size-base"]//div[@class="a-section review aok-relative"]/@id').extract()
                product_date = response.xpath('//div[@id="cm_cr-review_list"]//div[@class="a-section celwidget"]//span[@class="a-size-base a-color-secondary review-date"]/text()').extract()
                for rating,rating_id,date_and_country in zip(product_rating,product_rating_id,product_date):
                    amazon_reviews['product_id'] = self.product_id
                    amazon_reviews['product_rating'] = float(rating.strip(" ")[0])
                    amazon_reviews['product_rating_id'] = rating_id
                    #Convert date_and_country to just date (Ex. Reviewed in Germany 🇩🇪 on 17 September 2022 => 17 September 2022)
                    date = date_and_country.split("on ")[1]
                    #Convert date to datetime object (Ex. 17 September 2022 => 2022-09-17)
                    date_time = datetime.strptime(date, '%d %B %Y')

                    amazon_reviews['product_rating_date'] = date_time.strftime('%Y-%m-%d') 
                    amazon_reviews['mongo_db_column_name'] = GlobalVariables.mongo_column_reviews
                    yield amazon_reviews
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
        
