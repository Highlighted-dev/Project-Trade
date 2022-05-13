import urllib.request
import os

#TODO add proxies
# def getProxies():
#     #proxyscrape.com
#     proxyscrape = urllib.request.urlretrieve("https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=DE&ssl=no&anonymity=elite&simplified=true","./amazonscraper/proxy1.txt")
#     proxy1 = open('./amazonscraper/proxy1.txt', 'r')
#     Lines = proxy1.readlines()
#     allProxiesArray = []
#     for line in Lines:
#         allProxiesArray.append(line[:len(line)-1])
#     proxy1.close()
#     os.remove('./amazonscraper/proxy1.txt')
#     print(allProxiesArray)
#     return allProxiesArray

SPIDER_MODULES = ['amazonscraper.spiders']
NEWSPIDER_MODULE = 'amazonscraper.spiders'

#Splash settings
SPLASH_URL = 'http://localhost:8050'
DUPEFILTER_CLASS = 'scrapy_splash.SplashAwareDupeFilter'
HTTPCACHE_STORAGE = 'scrapy_splash.SplashAwareFSCacheStorage'

USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',

ROBOTSTXT_OBEY = False

SPIDER_MIDDLEWARES = {
    'scrapy_splash.SplashDeduplicateArgsMiddleware': 100,
}
# ROTATING_PROXY_LIST = getProxies()
# DOWNLOADER_MIDDLEWARES = {
#     'rotating_proxies.middlewares.RotatingProxyMiddleware': 610,
#     'rotating_proxies.middlewares.BanDetectionMiddleware': 610,
# }
DOWNLOADER_MIDDLEWARES = {
    'scrapy_splash.SplashCookiesMiddleware': 723,
    'scrapy_splash.SplashMiddleware': 725,
    'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810,
}

ITEM_PIPELINES = {
    'amazonscraper.pipelines.AmazonscraperPipeline': 300,
}

