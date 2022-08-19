import unittest
import sys
import os
#Add parent folder to sys paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tests.responses.__init__ import fake_response_from_file
try:
    from amazonscraper.amazonscraper.spiders.AmazonOneProductSpider import AmazonOneProductSpider
except ImportError:
    from amazonscraper.spiders.AmazonOneProductSpider import AmazonOneProductSpider


class AmazonOneProductSpiderTest(unittest.TestCase):

    #Scrapy spider setup
    def setUp(self):
        self.spider = AmazonOneProductSpider("any")

    def _test_item_results(self, results, expected_length):
        count=0
        #If any product information is None, unit test will fail
        for item in results:
            self.assertIsNotNone(item['product_id'])
            if item['mongo_db_column_name'] == 'amazonProductThumbImages':
                self.assertIsNotNone(item['product_thumb_image'])
            elif item['mongo_db_column_name'] == 'amazonProductDetails':
                self.assertIsNotNone(item['product_detail'])
                self.assertIsNotNone(item['product_detail_name'])
            elif item['mongo_db_column_name'] == 'amazonProductTechnicalDetails':
                self.assertIsNotNone(item['product_technical_detail'])
                self.assertIsNotNone(item['product_technical_detail_name'])
            elif item['mongo_db_column_name'] == 'amazonProductAbout':
                self.assertIsNotNone(item['product_about'])
            count+=1
        #Check if product has {expected_length} informations
        self.assertEqual(count, expected_length)

    def test_parse(self):
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage1.html'))
        self._test_item_results(results,27)
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage2.html'))
        self._test_item_results(results,21)

if __name__ == '__main__':
    unittest.main()