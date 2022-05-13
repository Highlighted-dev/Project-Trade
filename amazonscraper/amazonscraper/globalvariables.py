#Here are all important variables that you would like to change.
start_urls = [
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A571954&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A1966060031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A340849031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A571954&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A1966060031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A340849031&s=review-count-rank&language=en',
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank&language=en',
    ]
allowed_domains = ['amazon.de','amazon.fr']
max_pages_per_category_string = "10" #Up to 99
items_per_page = 24


#MongoDb related variables
mongoUrl = 'localhost:27017'
mongoDatabase = 'ProjectTrade'
mongoColumn = 'amazonProductData'
mongo_column_images = 'amazonProductImages'
mongo_column_details = 'amazonProductDetails'
mongo_column_technical_details = 'amazonProductTechnicalDetails'
mongo_column_about = 'amazonProductAbout'