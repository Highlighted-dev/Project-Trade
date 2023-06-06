import json
import math
import os
from pathlib import Path
import re
import scrapy
from datetime import date
import logging
import pymongo
from scrapy_splash import SplashFormRequest, SplashRequest

from .. import GlobalVariables
from ..items import AmazonItemPrice
from amazoncaptcha import AmazonCaptcha


# TODO If you can buy used product instead of new, product prices will scrape the used one | Change to the new one price ex.https://www.amazon.de/dp/B09JQZ5DYM?th=1
class AmazonProductPrices(scrapy.Spider):
    name = "AmazonProductPrices"
    allowed_domains = GlobalVariables.allowed_domains

    # Instance id is used to divide the product ids between the instances. Max instances is the total number of instances that will be running
    def __init__(
        self, prod_id=None, fetch_prod_ids_from_db=False, instance_id=1, max_instances=1
    ):
        self.start_urls = []
        self.client = pymongo.MongoClient(GlobalVariables.mongo_url)
        self.db = self.client[GlobalVariables.mongo_db]
        # If we want to scrape only one product, we can this by passing the product id as an argument.
        if prod_id:
            self.start_urls = ["https://www.amazon.de/-/en/dp/" + prod_id]
        elif fetch_prod_ids_from_db:
            # Get the product IDs from the database
            products_collection = self.db[GlobalVariables.mongo_column_products]
            product_ids = products_collection.find({}).distinct("product_id")

            # Calculate the start and end indexes for the sliced list
            start_index = self.calculate_start_index(
                product_ids, int(instance_id), int(max_instances)
            )
            end_index = self.calculate_end_index(
                product_ids, int(instance_id), int(max_instances)
            )

            # Slice the list of product IDs for the current instance
            instance_product_ids = product_ids[start_index:end_index]

            # Add the product URLs to the start URLs list
            if instance_product_ids:
                for prod_id in instance_product_ids:
                    self.start_urls.append("https://www.amazon.de/-/en/dp/" + prod_id)
        else:
            raise ValueError("No product id found")

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)

    def parse(self, response):
        try:
            prices = AmazonItemPrice()
            self.product_id = self.getProductId(response)
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                current_price = response.xpath(
                    '//div[@id="corePrice_feature_div"]//span[@class="a-price aok-align-center"]//span[@class="a-offscreen"]/text()'
                ).extract()
                if not current_price:
                    current_price = response.xpath(
                        '//div[@id="corePriceDisplay_desktop_feature_div"]//span[@class="a-price aok-align-center reinventPricePriceToPayMargin priceToPay"]//span[@class="a-offscreen"]/text()'
                    ).extract_first()
                current_date = date.today()
                prices["product_id"] = self.product_id
                prices["product_price"] = (
                    re.sub(r"[\'\[\]\€]|\bname\b", "", str(current_price))
                    if current_price
                    else None
                )
                prices["product_price_date"] = str(current_date)
                if not prices["product_price"]:
                    logging.warning("Unable to get price from url: %s", response.url)
                    last_price = list(
                        self.db[GlobalVariables.mongo_column_prices]
                        .find({"product_id": prices["product_id"]})
                        .sort("product_price_date", pymongo.DESCENDING)
                        .limit(1)
                    )[0]
                    prices["product_price"] = last_price["product_price"]
                yield prices
        except Exception as e:
            logging.error("Something went wrong while extracting items")
            logging.error(e)

    def getProductId(self, response):
        try:
            return response.url.split("/dp/")[1].split("/")[0]
        except Exception:
            logging.warning("Unable to get product id from url: %s", response.url)
            product_id = response.xpath('//input[@id="ASIN"]/@value').extract_first()
            if not product_id:
                product_id = response.xpath(
                    '//input[@id="deliveryBlockSelectAsin"]/@value'
                ).extract_first()
            if product_id:
                return product_id
            return "None"

    def checkForCaptcha(self, response):
        captcha_url = response.xpath(
            '//div[@class="a-row a-text-center"]/img/@src'
        ).extract_first()

        if captcha_url:
            logging.info("Found captcha on page!")
            return True
        else:
            return False

    def solveCaptcha(self, response, origin_method):
        logging.info("Trying to solve captcha...")
        try:
            # Get the captcha image url from website
            captcha_url = response.xpath(
                '//div[@class="a-row a-text-center"]/img/@src'
            ).extract_first()
            # Solve Captcha with AmazonCaptcha
            logging.info(str(captcha_url))
            captcha = AmazonCaptcha.fromlink(captcha_url)
            captcha_solution = captcha.solve()
            logging.info("Captcha solved!")
            yield SplashFormRequest.from_response(
                response,
                formdata={"field-keywords": captcha_solution},
                callback=origin_method,
            )
        except Exception as e:
            logging.error("Something went wrong while solving captcha\n")
            logging.error(e)
            return None

    def calculate_start_index(self, product_ids, instance_id, max_instances):
        # Calculate the start index for the sliced list of product IDs.
        num_product_ids = len(product_ids)
        start_index = math.ceil(num_product_ids / max_instances * (instance_id - 1))
        return start_index

    def calculate_end_index(self, product_ids, instance_id, max_instances):
        # Calculate the end index for the sliced list of product IDs.
        num_product_ids = len(product_ids)
        end_index = math.ceil(num_product_ids / max_instances * instance_id)
        return end_index

    def closed(self, reason):
        pathToJson = (str(Path(__file__).parents[2]) + f"/AmazonPrices.json").replace(
            os.sep, "/"
        )
        with open(pathToJson) as f:
            if os.stat(pathToJson).st_size > 0:
                file_data = json.load(f)
                bulk_operations = [
                    pymongo.ReplaceOne(
                        filter=(
                            {
                                "product_id": item["product_id"],
                                "product_price_date": item["product_price_date"],
                            }
                        ),
                        replacement=item,
                        upsert=True,
                    )
                    for item in file_data
                ]
                self.db[GlobalVariables.mongo_column_prices].bulk_write(bulk_operations)
        os.remove(pathToJson)
