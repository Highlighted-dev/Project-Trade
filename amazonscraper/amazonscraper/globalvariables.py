#Here are all important variables that you would like to change.
start_urls = [
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A571954&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A1966060031&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A340849031&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A571954&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A1966060031&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A340849031&s=review-count-rank',
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank',
    ]
allowed_domains = ['amazon.de','amazon.fr']
maxPagesPerCategoryString = "1" #Up to 99
itemsPerPage = 24


#MongoDb related variables
mongoUrl = 'localhost:27017'
mongoDatabase = 'ProjectTrade'
mongoColumn = 'amazonProductData'