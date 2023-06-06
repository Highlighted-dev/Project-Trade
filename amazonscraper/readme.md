# Amazon Webscraper
This project is a web scraper built using Scrapy that extracts data from a list of amazon websites and saves it to a JSON files

## Installation

1. Clone the repository to your local machine.
2. Install the required dependencies by running `pip install -r requirements.txt` in your terminal.
3.

# Usage
Quick documentation

## AmazonGetHighResImages

#### Run command

```
  scrapy crawl AmazonGetHighResImages -a prod_id=B002HAJQGA -o AmazonGetHighResImages.json
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `prod_id` | `string` | Specify product id for scraper (Amazon ASIN) | 
`testing` | `boolean` | Testing mode on/off (true/false)



## AmazonOneProductSpider

#### Run command

```
  scrapy crawl AmazonOneProductSpider -a prod_id=B002HAJQGA
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `prod_id` | `string` | Specify product id for scraper (Amazon ASIN) | 



## AmazonProductPrices

#### Run command

```
  scrapy crawl AmazonProductPrices -a fetch_prod_ids_from_db=True -o AmazonProductPrices.json
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `prod_id` | `string` |  **1/2 Required#1** Specify product id for scraper (Amazon ASIN) | 
`fetch_prod_ids_from_db` | `boolean` |  **2/2 Required#1** Should the program fetch ids from database (true/false)
`instance_id` | `int` | Current instance id (if using only one leave blank/put 1)
`max_instances` | `int` | Number of working instances (if using only one leave blank/put 1)

Required#1 1/2 and 2/2 means that ONLY ONE of these two is required



## AmazonReviewsSpider

#### Run command

```
  scrapy crawl AmazonReviewsSpider -a fetch_prod_ids_from_db=True -o AmazonReviewsSpider.json
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `prod_id` | `string` |  **1/2 Required#1** Specify product id for scraper (Amazon ASIN) | 
`fetch_prod_ids_from_db` | `boolean` |  **2/2 Required#1** Should the program fetch ids from database (true/false) | 
`testing` | `boolean` | Testing mode on/off (true/false)
`instance_id` | `int` | Current instance id (if using only one leave blank/put 1)
`max_instances` | `int` | Number of working instances (if using only one leave blank/put 1)

Required#1 1/2 and 2/2 means that ONLY ONE of these two is required


## AmazonProductSpider

#### Run command

```
  scrapy crawl AmazonProductSpider -o amazon_product_data.json
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `instance_id` | `int` | Current instance id (if using only one leave blank/put 1)
`max_instances` | `int` | Number of working instances (if using only one leave blank/put 1)



## Contributing

Contributions to this project are welcome. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes and commit them to your branch.
4. Push your changes to your forked repository.
5. Submit a pull request to the original repository.

## Credits

This project was built by Highlighted-dev using Scrapy, a Python web scraping framework

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

## Contact

For questions or support, please contact Highlighted.
