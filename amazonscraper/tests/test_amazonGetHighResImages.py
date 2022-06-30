import unittest
from responses import fake_response_from_file
import sys
import os
#Add parent folder to sys paths for scrapy spider import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import amazonscraper.spiders.AmazonGetHighResImages as AmazonGetHighResImages



#You need to be at "*\Project-Trade\amazonscraper\tests" to run the test properly
class AmazonGetHighResImagesrTest(unittest.TestCase):

    #Scrapy spider setup
    def setUp(self):
        self.spider = AmazonGetHighResImages.AmazonGetHighResImages("any")

    def _test_item_results(self, results, expected_length):
        count=0
        #If any product information is None, unit test will fail
        #Also here we won't check if some product_highres images are None, becouse amazon not allways provides high resolution images for products
        for item in results:
            self.assertIsNotNone(item['product_id'])
            count+=1
        #Check if product has {expected_length} informations
        self.assertEqual(count, expected_length)

    def test_parse(self):
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage1.html'))
        self._test_item_results(results,9)
        results = self.spider.parse(fake_response_from_file('offline_test_pages/unittestpage2.html'))
        self._test_item_results(results,7)

if __name__ == '__main__':
    unittest.main()