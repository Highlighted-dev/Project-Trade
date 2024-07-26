import logging
import scrapy
from ..items import AmazonscraperItem
import os
import pymongo
import json
from .. import GlobalVariables
from pathlib import Path
from scrapy_splash import SplashFormRequest, SplashRequest
from dotenv import load_dotenv

load_dotenv()

class AmazonProductSpider(scrapy.Spider):
    # vm_id = Virtual machine id, max_vm = Max virtual machines working at the same time
    def __init__(self, instance_id=1, max_instances=1):
        # For improving performance program will split start urls depending on how many virtual machines are working at the same time
        self.start_urls = GlobalVariables.start_urls[
            int(instance_id)
            * int(len(GlobalVariables.start_urls) / int(max_instances)) : (
                int(instance_id) + 1
            )
            * int(len(GlobalVariables.start_urls) / int(max_instances))
        ]
        if os.path.exists("amazon_product_data.json"):
            os.remove("amazon_product_data.json")

    name = "AmazonProductSpider"
    allowed_domains = GlobalVariables.allowed_domains

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse)

    def parse(self, response):
        try:
            items = AmazonscraperItem()
            # Getting data from amazon

            prod_id = response.xpath(
                '//div[@class="sg-col-4-of-24 sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 sg-col s-widget-spacing-small sg-col-4-of-20"]/@data-asin'
            ).extract()
            title = response.xpath(
                '//div[@class="a-section a-spacing-none a-spacing-top-small s-title-instructions-style"]//span[@class="a-size-base-plus a-color-base a-text-normal"]/text()'
            ).extract()
            sale_price = response.xpath(
                '//div[@class="a-section a-spacing-none a-spacing-top-small s-price-instructions-style"]//span[@class="a-price-whole"]/text()'
            ).extract()
            prod_image = response.xpath(
                '//div[@class="a-section aok-relative s-image-square-aspect"]//img[@class="s-image"]/@src'
            ).extract()
            for i in range(GlobalVariables.items_per_page):
                # Storing all data into items
                items["product_id"] = "".join(prod_id[i]).strip()
                items["product_name"] = "".join(title[i]).strip()
                try:
                    items["product_sale_price"] = "".join(sale_price[i]).strip()
                except:
                    items["product_sale_price"] = None
                items["product_image"] = "".join(prod_image[i]).strip()
                yield items
        except Exception as e:
            logging.error("Something went wrong when extracting items\n")
            logging.error(e)
        # Get current amazon (ex. amazon.de)
        current_amazon = str(response.request.url).split("/-", 1)[0]
        # Get next page URL
        next_page = current_amazon + "".join(
            response.xpath(
                '//div[@class="a-section a-text-center s-pagination-container"]//a[@class="s-pagination-item s-pagination-next s-pagination-button s-pagination-separator"]/@href'
            ).extract()
        )
        # If the page number equals maxPagesPerCategoryString, we don't want to go to the next page.
        if (
            str(next_page[-2 : len(next_page)])
            != GlobalVariables.max_pages_per_category_string
            and str(next_page[-2 : len(next_page)])
            != "_" + GlobalVariables.max_pages_per_category_string
        ):
            yield SplashFormRequest(next_page, callback=self.parse)

    # Send file.json to database when finished scraping
    def closed(self, reason):
        # Check if there is a file at that path
        # Get current path -> 2 directories up -> add file name -> replace "\" for "/"
        pathToJson = (
            str(Path(__file__).parents[2]) + "/amazon_product_data.json"
        ).replace(os.sep, "/")
        assert os.path.isfile(pathToJson)
        myclient = pymongo.MongoClient(os.getenv("MONGODB_URI"))
        mydb = myclient[GlobalVariables.mongo_db]
        mycol = mydb[GlobalVariables.mongo_column_products]
        with open(pathToJson) as f:
            file_data = json.load(f)
        # Try inserting files to mongoDB
        try:
            for obj in file_data:
                mycol.replace_one({"product_id": obj["product_id"]}, obj, upsert=True)
            logging.info("All products inserted to database successfully.")
            os.remove("amazon_product_data.json")
        except Exception as e:
            logging.error(
                "An error has occurred when trying to add products to database\n"
            )
            logging.error(e)
