from datetime import date
import logging
import unittest
import sys
import os
#Add parent folder to sys paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tests.setup.__init__ import fake_response_from_file
import json
#Second import is needed when you won't use python -m unittest discover
try:
    from amazonscraper.amazonscraper.spiders.AmazonReviewsSpider import AmazonReviewsSpider
except ImportError:
    from amazonscraper.spiders.AmazonReviewsSpider import AmazonReviewsSpider


class AmazonProductReviewsTest(unittest.TestCase):
    #Scrapy spider setup
    def setUp(self):
        #Create spider object
        self.spider = AmazonReviewsSpider("any", False, True)

    def get_expected_output(self, file_name):
        return json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__))) + f"\setup\Expected_results\{file_name}.json"))

    def _test_item_results(self, results, expected_length, expected_output):
        count=0
        for item,expected_item in zip(results,expected_output):
            logging.info(item)
            logging.info(count)
            #Comapre item with expected output 
            self.assertEqual(item['product_id'], expected_item['product_id'])
            self.assertEqual(item['product_rating'], expected_item['product_rating'])
            self.assertEqual(item['product_rating_id'], expected_item['product_rating_id'])
            self.assertEqual(item['product_rating_date'], expected_item['product_rating_date'])
            count+=1
        self.assertEqual(count, expected_length)
            
    def test_parse(self):
        #Get results from spider
        for which_test_is_it in range(1,5):

            results = self.spider.parse(fake_response_from_file(f'offline_test_pages/unittest_reviews{which_test_is_it}.html'))
            self._test_item_results(results, 10, self.get_expected_output(f"AmazonReviews_{which_test_is_it}")['data'])
            logging.info(f"log: Test {which_test_is_it} passed")  

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    runner = unittest.TextTestRunner(verbosity=2)
    unittest.main()