import logging
import json
import math
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

    def __init__(self, prod_id=None, fetch_prod_ids_from_db=False, testing=False, instance_id=1, max_instances=1):
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
                f"https://www.amazon.com/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent",
                f"https://www.amazon.com/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_paging_btm_next_5?sortBy=recent&pageNumber=5"
            ]
            self.db[GlobalVariables.mongo_column_reviews].delete_many(
                {"product_id": prod_id})
            logging.info(
                f"Successfully removed old data for product with id: {prod_id}")

        elif fetch_prod_ids_from_db:
            mongo_product_column = self.db[GlobalVariables.mongo_column_products]
            # db[GlobalVariables.mongo_column_reviews].delete_many({})
            # logging.info("Successfully removed old data for all products")
            prod_ids = mongo_product_column.distinct("product_id")

            if prod_ids:
                # Calculate the start and end indexes for the sliced list
                start_index = self.calculate_start_index(
                    prod_ids, int(instance_id), int(max_instances))
                end_index = self.calculate_end_index(
                    prod_ids, int(instance_id), int(max_instances))

                # Slice the list of product IDs for the current instance
                instance_product_ids = prod_ids[start_index:end_index]
                logging.info(
                    f"Instance {instance_id} of {max_instances} will scrape {len(instance_product_ids)} products")
                for prod_id in instance_product_ids:
                    self.start_urls.append(
                        f"https://www.amazon.com/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_viewopt_srt?sortBy=recent")
                    self.start_urls.append(
                        f"https://www.amazon.com/-/en/product-reviews/{prod_id}/ref=cm_cr_arp_d_paging_btm_next_2?sortBy=recent&pageNumber=2")
        else:
            raise ValueError(
                "You must pass either a product id or set fetch_prod_ids_from_db=True")

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)

    def parse(self, response):
        try:
            self.product_id = self.get_product_id(response)
            logging.info(
                "Extracting items from product with id: " + self.product_id)
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            elif self.checkForReviewsFromOtherCountries(response):
                return
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
            logging.warning(
                "Unable to get product id from url: %s", response.url)

            prod_id = response.xpath(
                '//div[@class="a-fixed-left-grid-col a-col-right"]//div[@class="a-fixed-left-grid-inner"]//a[@class="a-link-normal"]/@href').extract()
            if (prod_id):
                return prod_id[0].split("/dp/")[1]
            return "None"

    def calculate_start_index(self, product_ids, instance_id, max_instances):
        # Calculate the start index for the sliced list of product IDs.
        num_product_ids = len(product_ids)
        start_index = math.ceil(
            num_product_ids / max_instances * (instance_id - 1))
        return start_index

    def calculate_end_index(self, product_ids, instance_id, max_instances):
        # Calculate the end index for the sliced list of product IDs.
        num_product_ids = len(product_ids)
        end_index = math.ceil(num_product_ids / max_instances * instance_id)
        return end_index

    def checkForCaptcha(self, response):
        captcha_url = response.xpath(
            '//div[@class="a-row a-text-center"]/img/@src').extract_first()

        if captcha_url:
            logging.info('Found captcha on page!')
            return True
        else:
            return False

    def solveCaptcha(self, response, origin_method):
        logging.info("Trying to solve captcha...")
        try:
            # Get the captcha image url from website
            captcha_url = response.xpath(
                '//div[@class="a-row a-text-center"]/img/@src').extract_first()
            # Solve Captcha with AmazonCaptcha
            captcha = AmazonCaptcha.fromlink(captcha_url)
            captcha_solution = captcha.solve()
            logging.info("Captcha solved!")
            yield SplashFormRequest.from_response(response,
                                                  formdata={
                                                      'field-keywords': captcha_solution},
                                                  callback=origin_method)
        except Exception as e:
            logging.error("Something went wrong while solving captcha\n")
            logging.error(e)
            return None

    def checkForReviewsFromOtherCountries(self, response):
        reviews_from_other_country = response.xpath(
            '//div[@class="a-section a-spacing-none reviews-content a-size-base"]//h3[@data-hook="dp-global-reviews-header"]/text()').extract()
        if reviews_from_other_country:
            logging.warning("Reviews from different countries detected!")
            return True
        else:
            return False

    def format_date(self, date):
        date_time = datetime.strptime(date, '%B %d, %Y')
        return date_time.strftime('%Y-%m-%d')

    def get_reviews(self, response, product_id):
        reviews = response.xpath(
            '//div[@class="a-section a-spacing-none reviews-content a-size-base"]//div[@class="a-section review aok-relative"]')
        for review in reviews:
            rating = review.xpath(
                './/div[@class="a-row a-spacing-none"]//span[@class="a-icon-alt"]/text()').extract_first()
            rating_id = review.xpath('./@id').extract_first()
            date = review.xpath(
                './/span[@class="a-size-base a-color-secondary review-date"]/text()').extract_first()
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
        path_to_json = (
            str(Path(__file__).parents[2])+f'/AmazonReviews.json').replace(os.sep, '/')
        # Check if file is empty
        if os.stat(path_to_json).st_size == 0:
            logging.error("No data to insert into database!")
            os.remove(path_to_json)
            return
        try:
            with open(path_to_json) as f:
                file_data = json.load(f)
            if (self.insert_one_product_to_db):
                bulk_operations = [pymongo.InsertOne(
                    item) for item in file_data]
                self.db[GlobalVariables.mongo_column_reviews].bulk_write(
                    bulk_operations)
                os.remove(path_to_json)
                return

            logging.info("Finished scraping Amazon reviews")
            """
            !IMPORTANT This isn't valid anymore, change it!
            Because we don't have direct data about sales on Amazon, we will estimate it by using their reviews. 
            By different sources, we can estimate that 10% of customers who bought product will leave a review.
            Right now we are collecting reviews from 0 to 10 and from 11 to 20.
            That means we will get average date of first 10 reviews(1-10) and average date of last 10 reviews (11-20).
            So we will use this formula to estimate sales:
            (number_of_days_between_oldest_reviews - number_of_days_between_newest_reviews) + (current_date - number_of_days_between_oldest_reviews) = number_of_days_between_reviews
            Formula: 20 / number_of_days_beetween_dates * 10 = sales_per_day
            Ex. (07/07/2022 - 07/05/2021) + (09/07/2022 - 07/07/2022) = 20 / 63 * 10 = 7,93
            """
            product_ids = set()
            for item in file_data:
                product_ids.add(item['product_id'])
            for product_id in product_ids:
                sorted_reviews_by_date = sorted(
                    [item for item in file_data if item['product_id'] == product_id], key=lambda x: x['product_rating_date'])
                newest_reviews = sorted_reviews_by_date[len(
                    sorted_reviews_by_date)//2:]
                oldest_reviews = sorted_reviews_by_date[:len(
                    sorted_reviews_by_date)//2]

                def calculate_average_date_between_reviews(reviews):
                    try:
                        # Convert dates to datetime objects
                        date_objects = [datetime.strptime(
                            review['product_rating_date'], '%Y-%m-%d') for review in reviews]

                        # Calculate average timestamp
                        avg_timestamp = sum(date.timestamp()
                                            for date in date_objects) / len(date_objects)

                        # Convert average timestamp back to datetime object
                        avg_date = datetime.fromtimestamp(avg_timestamp)
                        return avg_date.date()
                    except ZeroDivisionError:
                        logging.error( "Couldn't estimate sales for product with id: " + product_id)
                        return None

                newest_review = calculate_average_date_between_reviews(
                    newest_reviews)
                oldest_review = calculate_average_date_between_reviews(
                    oldest_reviews)

                if newest_review is None or oldest_review is None:
                    continue

                logging.info("Newest review: "+str(newest_review))
                current_date = datetime.now()
                logging.info("Current date - oldest reviews: " + str((current_date.date() - oldest_review).days))
                # 27.08 - 25.07 + 29.08 - 25.07 = 33 + 35 = 68
                difference_between_days = (newest_review - oldest_review + current_date.date() - oldest_review).days
                sales_per_day = round(((20 / difference_between_days) * 10), 2)
                logging.info("Estimated sales for product with id: " +
                             product_id + " is: " + str(sales_per_day))
                sales_column = self.db[GlobalVariables.mongo_column_sales]
                sales_column.replace_one({"product_id": product_id, "product_sales_date": current_date.strftime(
                    '%Y-%m-%d')}, {"product_id": product_id, "sales_per_day": sales_per_day, 'product_sales_date': current_date.strftime('%Y-%m-%d')}, upsert=True)
        except Exception as e:
            logging.error("Something went wrong while closing spider\n")
            logging.error(e)
            os.remove(path_to_json)
            return
        os.remove(path_to_json)
