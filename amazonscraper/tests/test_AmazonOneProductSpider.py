import unittest
from responses import fake_response_from_file
import sys
sys.path.append("..")
import amazonscraper.spiders.AmazonOneProductSpider as AmazonOneProductSpider




class AmazonOneProductSpiderTest(unittest.TestCase):
    def setUp(self):
        self.spider = AmazonOneProductSpider.AmazonOneProductSpider("B08DLC9HBG")

    def _test_item_results(self, results):
        count = 0
        permalinks = set()
        for item in results:
            self.assertIsNotNone(item['product_id'])
            count+=1

    def test_parse(self):
        results = self.spider.parse(fake_response_from_file('AmazonOneProductSpider/1.html'))
        self._test_item_results(results)