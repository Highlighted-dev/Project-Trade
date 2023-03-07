# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from datetime import datetime
import logging
import pymongo
from . import GlobalVariables
class AmazonscraperPipeline:
    #TODO Make it faster (Change this to make json files and then send to database?)
    def open_spider(self, spider):
        self.client = pymongo.MongoClient(GlobalVariables.mongoUrl)
        self.db = self.client[GlobalVariables.mongoDatabase]
    def close_spider(self, spider):
        self.client.close()
    def process_item(self, item, spider):
        mongo_db_column_name = self.db[item['mongo_db_column_name']]
        try:
            match item['mongo_db_column_name']:
                case 'amazonProductThumbImages':
                    del item['mongo_db_column_name']
                    mongo_db_column_name.replace_one({"product_id":item["product_id"],"product_thumb_image":item["product_thumb_image"]},item,upsert=True)
                case 'amazonProductDetails':
                    del item['mongo_db_column_name']
                    mongo_db_column_name.replace_one({"product_id":item["product_id"],"product_detail_name":item["product_detail_name"]},item,upsert=True)
                case 'amazonProductTechnicalDetails':
                    del item['mongo_db_column_name']
                    mongo_db_column_name.replace_one({"product_id":item["product_id"],"product_technical_detail_name":item["product_technical_detail_name"]},item,upsert=True)
                case 'amazonProductAbout':
                    del item['mongo_db_column_name']
                    mongo_db_column_name.replace_one({"product_id":item["product_id"],"product_about":item["product_about"]},item,upsert=True)
                case 'amazonProductHighResImages':
                    del item['mongo_db_column_name']
                    mongo_db_column_name.replace_one({"product_id":item["product_id"],"product_highres_image":item["product_highres_image"]},item,upsert=True)
                case 'amazonProductPrices':
                    del item['mongo_db_column_name']
                    if not item["product_price"]:
                        #Get all items with same product_id from db and sort them by date
                        all_items_in_database = list(mongo_db_column_name.find({"product_id":item["product_id"]}))
                        all_items_in_database.sort(key=lambda r: datetime.strptime(r.get('product_price_date'), '%Y-%m-%d'))
                        #! Sometimes the price is not available, so we need to get the price from the previous day/days and make it as current price
                        for i in all_items_in_database[::-1]:
                            if(i["product_price"] != "None"):
                                item["product_price"] = i["product_price"]
                                break
                            
                    mongo_db_column_name.replace_one({"product_id":item["product_id"],"product_price_date":item["product_price_date"]},item,upsert=True)
                case 'None': #TODO add case for AmazonProductSpider
                    del item['mongo_db_column_name']
        except Exception as e:
            logging.error("Something went wrong while adding item to database\n")
            logging.error(e)
        return item

