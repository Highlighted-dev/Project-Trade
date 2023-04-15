import logging
import json
import os
from datetime import datetime
from pathlib import Path

import scrapy
from amazoncaptcha import AmazonCaptcha
import pymongo
from scrapy_splash import SplashFormRequest, SplashRequest

from .. import GlobalVariables
from ..items import AmazonItemReviews
class AmazonReviewsSpider(scrapy.Spider):
    name = 'AmazonReviewsSpider'
    allowed_domains = GlobalVariables.allowed_domains

    def __init__(self, prod_id = None,fetch_prod_ids_from_db = False,testing = False):
        super().__init__()
        logging.getLogger('scrapy').propagate = False
        self.insert_one_product_to_db = False

        if testing:
            return

        self.client = pymongo.MongoClient(GlobalVariables.mongo_url)
        self.db = self.client[GlobalVariables.mongo_db]

        if prod_id:
            self.insert_one_product_to_db = True
            self.start_urls = [
                f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent", 
                f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_paging_btm_next_5?sortBy=recent&pageNumber=5"
            ]
            self.db[GlobalVariables.mongo_column_reviews].delete_many({"product_id": prod_id})
            logging.info(f"Successfully removed old data for product with id: {prod_id}")

        elif fetch_prod_ids_from_db:
            mongo_product_column = self.db[GlobalVariables.mongo_column_products]
            # db[GlobalVariables.mongo_column_reviews].delete_many({})
            # logging.info("Successfully removed old data for all products")
            prod_ids = mongo_product_column.distinct("product_id")
            if prod_ids:
                for prod_id in prod_ids:
                    self.start_urls.append(f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent")
                    self.start_urls.append(f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_paging_btm_next_5?sortBy=recent&pageNumber=5")
        else:
            raise ValueError("You must pass either a product id or set fetch_prod_ids_from_db=True")

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)
    
    def parse(self, response):
        try:
            self.product_id = self.get_product_id(response)
            logging.info("Extracting items from product with id: " + self.product_id)
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                for review in self.get_reviews(response, self.product_id):
                    yield review
        except Exception as e:
            logging.error("Something went wrong while extracting items\n")
            logging.error(e)      

    
    def get_product_id(self, response):
        try:
            return response.url.split("/product-reviews/")[1].split("/")[0]
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
            yield SplashFormRequest.from_response(response,
                                        formdata={'field-keywords': captcha_solution},
                                        callback=origin_method)
        except Exception as e:
            logging.error("Something went wrong while solving captcha\n")
            logging.error(e)
            return None
        
    def format_date(self, date):
        date_time = datetime.strptime(date, '%d %B %Y')
        return date_time.strftime('%Y-%m-%d')
    
    def get_reviews(self, response, product_id):
        reviews = response.xpath('//div[@id="cm_cr-review_list"]//div[@class="a-section review aok-relative"]')
        for review in reviews:
            rating = review.xpath('.//div[@class="a-row a-spacing-none"]//span[@class="a-icon-alt"]/text()').extract_first()
            rating_id = review.xpath('./@id').extract_first()
            date = review.xpath('.//span[@class="a-size-base a-color-secondary review-date"]/text()').extract_first()
            product_rating = float(rating.strip(" ")[0])
            date_formatted = self.format_date(date.split("on ")[1])
            item = AmazonItemReviews(
                product_id=product_id,
                product_rating=product_rating,
                product_rating_id=rating_id,
                product_rating_date=date_formatted,
            )
            yield item
            
    
    def closed(self, reason):
        pathToJson = (str(Path(__file__).parents[2])+f'/AmazonReviews.json').replace(os.sep, '/')
        with open(pathToJson) as f:
            file_data = json.load(f)
        if(self.insert_one_product_to_db):
            bulk_operations = [pymongo.InsertOne(item) for item in file_data]
            self.db[GlobalVariables.mongo_column_reviews].bulk_write(bulk_operations)
            os.remove(pathToJson)
            return
            
        logging.info("Finished scraping Amazon reviews")
        """
        Becouse we don't have direct data about sales on Amazon, we will estimate it by using their reviews. 
        By different sources, we can estimate that 10% of customers who bought product will leave a review.
        Right now we are collecting reviews from 0 to 10 and from 40 to 50.
        That means we will get average date of first 10 reviews(1-10) and average date of last 10 reviews (41-50).
        So we will use this formula to estimate sales:
        (number_of_days_between_oldest_reviews - number_of_days_between_newest_reviews) + (current_date - number_of_days_between_oldest_reviews) = number_of_days_between_reviews
        Formula: 50 / number_of_days_beetween_dates * 10 = sales_per_day
        Ex. (07/07/2022 - 07/05/2021) + (09/07/2022 - 07/07/2022) = 50 / 63 * 10 = 7,93
        */
        """
        column = self.db[GlobalVariables.mongo_column_reviews]
        # #Try inserting files to mongoDB
        # try:
        #     for obj in file_data:
        #         #! Validation isn't done yet.
        #         column.insert_one(obj)
        #     logging.info("All products inserted to database successfully.")        
        # except Exception as e:
        #     logging.error("An error has occurred when trying to add products to database\n")
        #     logging.error(e)

        product_ids = column.find({}).distinct("product_id")
        for product_id in product_ids:
            counted_reviews = column.count_documents({"product_id":product_id})
            if(counted_reviews <= 3):
                continue
            first_10_reviews = column.find({"product_id":product_id}).sort("product_rating_date", 1)[counted_reviews/2:]
            last_10_reviews = column.find({"product_id":product_id}).sort("product_rating_date", 1)[:counted_reviews/2]
            newest_reviews, oldest_reviews = [],[]
            for newest_review,oldest_review in zip(first_10_reviews,last_10_reviews):
                newest_reviews.append(datetime.strptime(newest_review.get("product_rating_date"),'%Y-%m-%d'))
                oldest_reviews.append(datetime.strptime(oldest_review.get("product_rating_date"),'%Y-%m-%d'))
            def calculate_days_between_reviews(reviews):
                mx = max(reviews)
                mn = min(reviews)
                diff = (mx - mn)/(len(reviews)-1)
                return diff
            number_of_days_between_newest_reviews = calculate_days_between_reviews(newest_reviews)
            number_of_days_between_oldest_reviews = calculate_days_between_reviews(oldest_reviews)

            current_date = datetime.now()
            number_of_days_between_reviews = (number_of_days_between_oldest_reviews.days - number_of_days_between_newest_reviews.days) + ((current_date - oldest_reviews[len(oldest_reviews)-1]).days)
            sales_per_day = round(50 / number_of_days_between_reviews * 10, 2)
            logging.info("Estimated sales for product with id: " + product_id + " is: " + str(sales_per_day))
            sales_column = self.db[GlobalVariables.mongo_column_sales]
            sales_column.replace_one({"product_id":product_id,"product_sales_date":current_date.strftime('%Y-%m-%d')},{"product_id":product_id,"sales_per_day":sales_per_day,'product_sales_date':current_date.strftime('%Y-%m-%d')},upsert=True)
