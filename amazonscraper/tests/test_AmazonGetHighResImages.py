import logging
import unittest
import sys
import os
#Add parent folder to sys paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from tests.setup.__init__ import fake_response_from_file
#Second import is when you won't use python -m unittest discover
try:
    from amazonscraper.amazonscraper.spiders.AmazonGetHighResImages import AmazonGetHighResImages
except ImportError:
    from amazonscraper.spiders.AmazonGetHighResImages import AmazonGetHighResImages

class AmazonGetHighResImagesrTest(unittest.TestCase):

    #Scrapy spider setup
    def setUp(self):
        self.spider = AmazonGetHighResImages("any")

    def _test_item_results(self, results, expected_length):
        count=0
        #Also here we won't check if some product_highres images are None, becouse amazon not allways provides high resolution images for products
        for item in results:
            self.assertIsNotNone(item['product_id'])
            count+=1
        #Check if product has {expected_length} [example: 9] informations
        self.assertEqual(count, expected_length)

    def test_parse(self):
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage1.html'))
        self._test_item_results(results,9)
        logging.info("log: Test 1 passed")

        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage2.html'))
        self._test_item_results(results,7)
        logging.info("log: Test 2 passed") 

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    runner = unittest.TextTestRunner(verbosity=2)
    unittest.main()