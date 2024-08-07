from pathlib import Path
import scrapy
from .. import GlobalVariables
from amazoncaptcha import AmazonCaptcha
from ..items import AmazonItemHighResImages
import logging
from scrapy_splash import SplashFormRequest, SplashRequest
import re
import pymongo
import os
import json
import time
from dotenv import load_dotenv

load_dotenv()


class AmazonGetHighResImages(scrapy.Spider):
    name = "AmazonGetHighResImages"
    allowed_domains = GlobalVariables.allowed_domains

    def __init__(self, prod_id, testing=False):
        self.product_id = prod_id
        self.start_urls = ["https://www.amazon.de/-/en/dp/" + self.product_id]

        if testing:
            return

        self.client = pymongo.MongoClient(os.getenv("MONGODB_URI"))
        self.db = self.client[GlobalVariables.mongo_db]

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)

    def parse(self, response):
        try:
            images = AmazonItemHighResImages()
            if self.checkForCaptcha(response):
                yield from self.solveCaptcha(response, self.parse)
            else:
                # Getting data from amazon
                product_highres_images = str(
                    response.xpath(
                        '//div[@id="dp-container"]//div[@id="leftCol"]//script/text()'
                    ).extract()
                )
                # Format string product_highres_images with regular expression
                # Example input:  { \'initial\': [{"hiRes":"https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SL1500_.jpg", ...]} | { \'initial\': [{"hiRes":null, ...]}
                # Example output: https://m.media-amazon.com/images/I/61HC1k6PJmL._AC_SL1500_.jpg | null
                format_product_highres_images = re.findall(
                    r'"hiRes":(".*?"|null)', product_highres_images
                )
                for highres_image in format_product_highres_images:
                    images["product_id"] = self.product_id
                    # If image link isn't null that means it has 2 quotes - delete them
                    if highres_image != "null":
                        images["product_highres_image"] = highres_image[1:-1]
                    else:
                        images["product_highres_image"] = highres_image
                    yield images

        except Exception as e:
            logging.error("Something went wrong while extracting items\n")
            logging.error(e)

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
            captcha_url = response.xpath(
                '//div[@class="a-row a-text-center"]/img/@src'
            ).extract_first()
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

    def closed(self, reason):
        pathToJson = (
            str(Path(__file__).parents[2]) + "/AmazonGetHighResImages.json"
        ).replace(os.sep, "/")
        assert os.path.isfile(pathToJson)
        with open(pathToJson) as f:
            items = json.load(f)
        bulk_operations = [
            pymongo.ReplaceOne(
                filter=(
                    {
                        "product_id": item["product_id"],
                        "product_highres_image": item["product_highres_image"],
                    }
                ),
                replacement=item,
                upsert=True,
            )
            for item in items
        ]
        self.db[GlobalVariables.mongo_column_highres_images].bulk_write(bulk_operations)
        os.remove(pathToJson)
