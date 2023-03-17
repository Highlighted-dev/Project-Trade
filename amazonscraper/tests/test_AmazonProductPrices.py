from datetime import date
import logging
import unittest
import sys
import os
#Add parent folder to sys paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tests.setup.__init__ import fake_response_from_file
#Second import is needed when you won't use python -m unittest discover
try:
    from amazonscraper.amazonscraper.spiders.AmazonProductPrices import AmazonProductPrices
except ImportError:
    from amazonscraper.spiders.AmazonProductPrices import AmazonProductPrices


class AmazonProductPricesTest(unittest.TestCase):
    #Scrapy spider setup
    def setUp(self):
        #Create spider object
        self.spider = AmazonProductPrices("any")
        self.expected_output = {\
            "item1": \
                {'product_id': 'None', 'product_price': '239.00', 'product_price_date': str(date.today()), 'mongo_db_column_name': 'amazonProductPrices'},\
            "item2": \
                {'product_id': 'None', 'product_price': '24.99', 'product_price_date': str(date.today()), 'mongo_db_column_name': 'amazonProductPrices'}\
            }

    def _test_item_results(self, results, item_name):
        for item in results:
            #Comapre item with expected output 
            self.assertEqual(item['product_id'], self.expected_output[item_name]['product_id'])
            self.assertEqual(item['product_price'], self.expected_output[item_name]['product_price'])
            self.assertEqual(item['product_price_date'], self.expected_output[item_name]['product_price_date'])
            self.assertEqual(item['mongo_db_column_name'], self.expected_output[item_name]['mongo_db_column_name'])
            
    def test_parse(self):
        #Get results from spider
        for which_test_is_it in range(1,3):
            results = self.spider.parse(fake_response_from_file(f'offline_test_pages/unittestpage{which_test_is_it}.html'))
            self._test_item_results(results, f"item{which_test_is_it}")
            logging.info(f"log: Test {which_test_is_it} passed")  
      

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    runner = unittest.TextTestRunner(verbosity=2)
    unittest.main()