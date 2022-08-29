Requirements:
pip install scrapy
pip install pymongo
pip install amazoncaptcha
pip install scrapy-splash
pip install python-dotenv
Docker

How to start:
docker run -p 5023:5023 -p 8050:8050 -p 8051:8051 scrapinghub/splash
=====================================================================
For AmazonProductSpider run 'runscraper.bat'
=====================================================================
For AmazonOneProductSpider go to .\amazonscraper and enter command 'scrapy crawl AmazonOneProductSpider -a prod_id="B08DLC9HBG"'
