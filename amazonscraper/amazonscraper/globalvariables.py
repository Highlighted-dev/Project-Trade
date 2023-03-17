#Here are all important variables that you would like to change.
#!HOW TO CREATE WORKING URL
#1.Go to any amazon category
#2. Copy its url | Ex. https://www.amazon.de/-/en/gp/browse.html?node=429874031, https://www.amazon.de/-/en/b/node=21617878031
#3. Remove anything before 'node=xyz'. Ex https://www.amazon.de/-/en/gp/browse.html?node=42987403 ->  https://www.amazon.de/node=42987403, https://www.amazon.de/-/en/b/node=21617878031 -> https://www.amazon.de/node=21617878031
#4. Add s? before 'node=xyz' and &s=review-count-rank&language=en after it Ex. https://www.amazon.de/node=42987403 -> https://www.amazon.de/s?node=42987403&s=review-count-rank&language=en, https://www.amazon.de/node=21617878031 -> https://www.amazon.de/s?node=21617878031&s=review-count-rank&language=en
#5. Click enter and copy link from the browser.
start_urls = [
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A571954&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A1966060031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A340849031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A1981299031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A1981666031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A429867031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A429874031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A429870031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A389968011&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A3517801&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A2864212031&s=review-count-rank&language=en'
        

    ]
allowed_domains = ['amazon.de']
max_pages_per_category_string = "10" #Up to 99
items_per_page = 24


#MongoDb related variables
mongoUrl = 'mongodb+srv://root:root@project-trade.d28vx.mongodb.net/project-trade'
mongoDatabase = 'project-trade'
mongoColumn = 'amazonProductData'
mongo_column_thumb_images = 'amazonProductThumbImages'
mongo_column_details = 'amazonProductDetails'
mongo_column_technical_details = 'amazonProductTechnicalDetails'
mongo_column_about = 'amazonProductAbout'
mongo_column_highres_images = 'amazonProductHighResImages'
mongo_column_prices = 'amazonProductPrices'
mongo_column_reviews = 'amazonProductReviews'
mongo_column_sales = 'amazonProductSales'