from datetime import date
import logging
import unittest
import sys
import os
#Add parent folder to sys paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tests.setup.__init__ import fake_response_from_file
#Second import is when you won't use python -m unittest discover
try:
    from amazonscraper.amazonscraper.spiders.AmazonReviewsSpider import AmazonReviewsSpider
except ImportError:
    from amazonscraper.spiders.AmazonReviewsSpider import AmazonReviewsSpider


class AmazonProductReviewsTest(unittest.TestCase):
    #Scrapy spider setup
    def setUp(self):
        #Create spider object
        self.spider = AmazonReviewsSpider("any")


    def _test_item_results(self, results, expected_length):
        count=0
        for item in results:
            #Comapre item with expected output 
            self.assertIsNotNone(item['product_id'])
            self.assertIsNotNone(item['product_rating'])
            self.assertIsNotNone(item['product_rating_id'])
            self.assertIsNotNone(item['product_rating_date'])
            count+=1
        self.assertEqual(count, expected_length)
            
    def test_parse(self):
        #Get results from spider
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittest_reviews1.html'))
        self._test_item_results(results, 10)
        logging.info("log: Test 1 passed")  
        
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittest_reviews2.html'))
        self._test_item_results(results, 10)
        logging.info("log: Test 2 passed") 

        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittest_reviews3.html'))
        self._test_item_results(results, 10)
        logging.info("log: Test 3 passed") 

        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittest_reviews4.html'))
        self._test_item_results(results, 10)
        logging.info("log: Test 4 passed") 

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    runner = unittest.TextTestRunner(verbosity=2)
    unittest.main()