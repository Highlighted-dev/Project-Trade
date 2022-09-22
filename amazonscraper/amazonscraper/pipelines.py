# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
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
                    mongo_db_column_name.replace_one({"product_id":item["product_id"],"product_price_date":item["product_price_date"]},item,upsert=True)
                case 'amazonProductReviews':
                    del item['mongo_db_column_name']
                    logging.info('test')
                    mongo_db_column_name.insert_one(dict(item))
                case 'None': #TODO add case for AmazonProductSpider
                    del item['mongo_db_column_name']
        except Exception as e:
            logging.error("Something went wrong while adding item to database\n")
            logging.error(e)
        return item

