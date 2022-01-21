from wsgiref import headers
import scrapy
from amazonscraper.items import AmazonscraperItem
import os
class AmazonproductspiderSpider(scrapy.Spider):
    if os.path.exists("file.json"):
        os.remove("file.json")
    name = 'AmazonProductSpider'
    allowed_domains = ['amazon.de','amazon.fr']
    headers = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
    start_urls = [
        'https://www.amazon.de/-/pl/dp/B08TTYBD3K/ref=zg-bs_sports_1/258-5473885-2631100?pd_rd_w=rL4po&pf_rd_p=25d6d4f8-2717-4a48-97fc-9b1a75c8d109&pf_rd_r=PE4YQNN81E6NQQ3Z4GN4&pd_rd_r=97be3da3-b27d-496c-bd76-08fd2e9bcb6a&pd_rd_wg=H86tv&pd_rd_i=B08TTYBD3K&psc=1',
        'https://www.amazon.de/-/pl/dp/B08WM2MFKF/?_encoding=UTF8&pf_rd_p=14f5fda5-66cd-4f06-b05d-3ca26c4af1f9&pd_rd_wg=0Wq6m&pf_rd_r=TJQYN7GEW71JX47P5Q4V&pd_rd_w=EMWaA&pd_rd_r=ffad8202-f581-4ec4-b022-51b7a83439a8&ref_=pd_gw_trq_ed_l54jbvqo',
        'https://www.amazon.de/-/pl/dp/B096X761NM/ref=zg-bs_sports_5/258-5473885-2631100?pd_rd_w=BwSTW&pf_rd_p=25d6d4f8-2717-4a48-97fc-9b1a75c8d109&pf_rd_r=3XM6GCD9KTRTR00AT58Q&pd_rd_r=9297bec2-f6b4-4bbb-9d0d-81a104a5dbfa&pd_rd_wg=0tDVb&pd_rd_i=B096XZ73MW&psc=1',
        'https://www.amazon.fr/HP-cartouches-couleurs-authentiques-N9J72AE/dp/B01AGGJ44K/ref=zg-bs_computers_1/258-6017052-5721912?pd_rd_w=MmbrG&pf_rd_p=f492caf8-8007-48d2-883a-38800a772222&pf_rd_r=1N27GZ3SCFRKWA63C3DM&pd_rd_r=fcf1077e-30f5-44e3-8839-f75bdc2a010e&pd_rd_wg=B5cRD&pd_rd_i=B01AGGJ44K&psc=1',
        'https://www.amazon.fr/Multicolore-T%C3%A9l%C3%A9commande-Lumineuse-L%C3%A9clairage-D%C3%A9coration/dp/B085SZBCQZ/ref=zg-bs_lighting_2/258-6017052-5721912?pd_rd_w=eeqRk&pf_rd_p=f492caf8-8007-48d2-883a-38800a772222&pf_rd_r=1N27GZ3SCFRKWA63C3DM&pd_rd_r=fcf1077e-30f5-44e3-8839-f75bdc2a010e&pd_rd_wg=B5cRD&pd_rd_i=B08JJ1XV5J&psc=1',
    ]

    def parse(self, response):
        items = AmazonscraperItem()
        title = response.xpath('//h1[@id="title"]/span/text()').extract()
        sale_price = response.xpath('//div[@class="a-section a-spacing-micro"]//span[contains(@class,"a-price aok-align-center") or contains(@class,"a-price a-text-price a-size-medium")]//span[@class="a-offscreen"]/text()').extract()
        category = response.xpath('//a[@class="a-link-normal a-color-tertiary"]/text()').extract()
        availability = response.xpath('//div[@id="availability"]//text()').extract()
        items['product_name'] = ''.join(title).strip()
        items['product_sale_price'] = ''.join(sale_price).strip()
        items['product_category'] = ','.join(map(lambda x: x.strip(), category)).strip()
        items['product_availability'] = ''.join(availability).strip()

        yield items
