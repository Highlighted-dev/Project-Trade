import unittest
import sys
import os
#Add parent folder to sys paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tests.responses.__init__ import fake_response_from_file
try:
    from amazonscraper.amazonscraper.spiders.AmazonProductPrices import AmazonProductPrices
except ImportError:
    from amazonscraper.spiders.AmazonProductPrices import AmazonProductPrices


class AmazonProductPricesTest(unittest.TestCase):

    #Scrapy spider setup
    def setUp(self):
        self.spider = AmazonProductPrices("any")

    def _test_item_results(self, results, expected_length):
        count=0
        #If any product information is None, unit test will fail
        for item in results:
            self.assertIsNotNone(item['product_id'])
            self.assertIsNotNone(item['product_price'])
            self.assertIsNotNone(item['product_price_date'] )
            self.assertIsNotNone(item['mongo_db_column_name'] )
            count+=1
            
        #Check if product has {expected_length} informations
        self.assertEqual(count, expected_length)

    def test_parse(self):
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage1.html'))
        self._test_item_results(results,1)
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage2.html'))
        self._test_item_results(results,1)

if __name__ == '__main__':
    unittest.main()