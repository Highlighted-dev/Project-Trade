#Here are all important variables that you would like to change.
start_urls = [
        'https://www.amazon.de/s?rh=n%3A571860&s=review-count-rank',
        #'https://www.amazon.de/s?rh=n%3A571954&s=review-count-rank',
        #'https://www.amazon.de/s?rh=n%3A1966060031&s=review-count-rank',
        #'https://www.amazon.de/s?rh=n%3A340849031&s=review-count-rank',
        #'https://www.amazon.de/s?rh=n%3A236861011&s=review-count-rank',
    ]
allowed_domains = ['amazon.de','amazon.fr']
maxPagesPerCategoryString = "10" #Up to 99
pathToJson =('C:/Programowanie/Projekty/Project-Trade/amazonscraper/file.json')

#MongoDb related stuff
mongoUrl = 'localhost:27017'
mongoDatabase = 'ProjectTrade'
mongoColumn = 'amazonProductData'