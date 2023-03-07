import datetime
import json
import os
import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
from ..items import AmazonItemReviews
import logging
from datetime import datetime
import pymongo
from pathlib import Path
class AmazonReviewsSpider(scrapy.Spider):
    def __init__(self, prod_id = None,fetch_prod_ids_from_db = False):
        logging.getLogger('scrapy').propagate = False
        self.start_urls = []
        self.insert_one_product_to_db = False
        client = pymongo.MongoClient(GlobalVariables.mongoUrl)
        db = client[GlobalVariables.mongoDatabase]
        #If we want to scrape only one product, we can this by passing the product id as an argument.
        if(prod_id):
            self.product_id = prod_id
            self.insert_one_product_to_db = True
            self.start_urls = [f"https://www.amazon.de/-/en/product-reviews/{self.product_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent",f"https://www.amazon.de/-/en/product-reviews/{self.product_id}/ref=cm_cr_arp_d_paging_btm_next_5?sortBy=recent&pageNumber=5"]              
            column = db[GlobalVariables.mongo_column_reviews]
            column.delete_many({"product_id":self.product_id})
            logging.info("Successfully removed old data for product with id: " + self.product_id)
        elif(fetch_prod_ids_from_db):
            mongdo_product_column = db[GlobalVariables.mongoColumn]
            # db[GlobalVariables.mongo_column_reviews].delete_many({})
            # logging.info("Successfully removed old data for all products")
            prod_ids = mongdo_product_column.find({}).distinct("product_id")  
            if prod_ids:
                for prod_id in prod_ids:
                    self.start_urls.append(f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent")
                    self.start_urls.append(f"https://www.amazon.de/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_paging_btm_next_5?sortBy=recent&pageNumber=5")
        else:
            raise ValueError("You must pass either a product id or set fetch_prod_ids_from_db=True")
        client.close()
    name = 'AmazonReviewsSpider'
    allowed_domains = GlobalVariables.allowed_domains


    def parse(self, response):
        try:
            amazon_reviews = AmazonItemReviews()
            logging.info(response.url)
            self.product_id = response.url.split('https://www.amazon.de/-/en/product-reviews/')[1].split('/ref=')[0]
            logging.info("Extracting items from product with id: " + self.product_id)
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                product_rating = response.xpath('//div[@id="cm_cr-review_list"]//div[@class="a-section celwidget"]//div[@class="a-row"]//span[@class="a-icon-alt"]/text()').extract()
                if(len(product_rating) == 0):
                    product_rating = response.xpath('//div[@id="cm_cr-review_list"]//div[@class="a-section review aok-relative"]//div[@class="a-row a-spacing-none"]//span[@class="a-icon-alt"]/text()').extract()      
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
                    if(self.insert_one_product_to_db):
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
    def closed(self, reason):  
        if(self.insert_one_product_to_db):
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
        client = pymongo.MongoClient(GlobalVariables.mongoUrl)
        db = client[GlobalVariables.mongoDatabase]
        column = db[GlobalVariables.mongo_column_reviews]
        # pathToJson = (str(Path(__file__).parents[2])+f'/file.json').replace(os.sep, '/')
        # with open(pathToJson) as f:
        #     file_data = json.load(f)
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
            logging.info("Number of reviews: " + str(counted_reviews))
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
            logging.info("Number of days between reviews: " + str(number_of_days_between_reviews))
            sales_per_day = round(50 / number_of_days_between_reviews * 10, 2)
            logging.info("Estimated sales for product with id: " + product_id + " is: " + str(sales_per_day))
            sales_column = db[GlobalVariables.mongo_column_sales]
            sales_column.replace_one({"product_id":product_id,"product_sales_date":current_date.strftime('%Y-%m-%d')},{"product_id":product_id,"sales_per_day":sales_per_day,'product_sales_date':current_date.strftime('%Y-%m-%d')},upsert=True)
