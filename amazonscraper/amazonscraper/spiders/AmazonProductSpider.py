from wsgiref import headers
import scrapy
from amazonscraper.items import AmazonscraperItem

class AmazonproductspiderSpider(scrapy.Spider):
    name = 'AmazonProductSpider'
    allowed_domains = ['amazon.de']
    headers = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
    start_urls = ['https://www.amazon.de/-/pl/dp/B08TTYBD3K/ref=zg-bs_sports_1/258-5473885-2631100?pd_rd_w=rL4po&pf_rd_p=25d6d4f8-2717-4a48-97fc-9b1a75c8d109&pf_rd_r=PE4YQNN81E6NQQ3Z4GN4&pd_rd_r=97be3da3-b27d-496c-bd76-08fd2e9bcb6a&pd_rd_wg=H86tv&pd_rd_i=B08TTYBD3K&psc=1']

    def parse(self, response):
        items = AmazonscraperItem()
        title = response.xpath('//h1[@id="title"]/span/text()').extract()
        sale_price = response.xpath('//div[@class="a-section a-spacing-micro"]//span[@class="a-offscreen"]/text()').extract()
        category = response.xpath('//a[@class="a-link-normal a-color-tertiary"]/text()').extract()
        availability = response.xpath('//div[@id="availability"]//text()').extract()
        items['product_name'] = ''.join(title).strip()
        items['product_sale_price'] = ''.join(sale_price).strip()
        items['product_category'] = ','.join(map(lambda x: x.strip(), category)).strip()
        items['product_availability'] = ''.join(availability).strip()
        yield items
