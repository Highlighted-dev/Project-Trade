import express, { Request, response, Response, Router } from 'express';
import AmazonProductData from '../models/AmazonProductDataModel';
import AmazonProductDetails from '../models/AmazonProductDetailsModel';
import AmazonProductThumbImages from '../models/AmazonProductThumbImagesModel';
import AmazonProductTechnicalDetails from '../models/AmazonProductTechnicalDetailsModel';
import AmazonProductAbout from '../models/AmazonProductAboutModel';
import AmazonProductHighResImages from '../models/AmazonProductHighResImagesModel';
import { Model } from 'mongoose';
import AmazonProductPrices from '../models/AmazonProductPrices';
import axios, { AxiosError } from 'axios';
import AmazonProductReviews from '../models/AmazonProductReviews';
import amazonProductSales from '../models/AmazonProductSales';

const router: Router = express.Router();

const getAmazonProductData = async (
  //Request variable, Response variable, name of the model
  req: Request,
  res: Response,
  modelName: Model<any, any, any, any>,
  scrapingUrl: string = ''
) => {
  const { id } = req.params;
  const amazon_product_data = await modelName.find({
    product_id: id,
  });
  //If json is not empty that means program found data
  if (amazon_product_data.length > 0) {
    return res.status(200).json({
      status: 'ok',
      message: 'data found!',
      data: amazon_product_data,
    });
  }
  //If scraping url is set, program will try to scrape data. It will only be set for images(becouse every amazon product has at least 1 image) and highres images
  else if (scrapingUrl.length > 0) {
    getRequestWithAxios(scrapingUrl + id)
      .then(async response => {
        if (response.status == 200) {
          const amazon_product_data = await modelName.find({
            product_id: id,
          });
          return res.status(200).json({
            status: 'ok',
            message: 'Product data successfully scraped and added to database.',
            data: amazon_product_data,
          });
        } else return res.status(500).json(response.data);
      })
      .catch((err: AxiosError) => {
        axiosErrorHandler(err, res);
      });
  }

  //Program didn't find any data, but it's okay becouse sometimes there isn't this type of data on Amazon
  else {
    return res
      .status(200)
      .json({ status: 'ok', message: 'Couldnt find the data' });
  }
};

const getAmazonSpecificDataOrUpdateIfNeeded = async (
  req: Request,
  res: Response,
  modelName: Model<any, any, any, any>,
  scrapingUrl: string
) => {
  const { id } = req.params;
  var amazon_data = await modelName.find({
    product_id: id,
  });

  //Getting current date (for checking if data is old)
  var yourDate = new Date();
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);

  if (
    //If program found data and today's date is equal to product_price_date of last update (Ex. 07/07/2022 (today) == 07/07/2022 (last update))
    amazon_data.length > 0 &&
    yourDate.toISOString().split('T')[0] ==
      amazon_data[amazon_data.length - 1].product_price_date
  )
    res.status(200).json({
      status: 'ok',
      message: 'Product specific data found!',
      data: amazon_data,
    });
  else {
    getRequestWithAxios(scrapingUrl + id)
      .then(async response => {
        if (response.status == 200) {
          amazon_data = await AmazonProductPrices.find({
            product_id: id,
          });
          //If program succesfuly scraped new data and then found them in database
          if (
            amazon_data.length > 0 &&
            yourDate.toISOString().split('T')[0] ==
              amazon_data[amazon_data.length - 1].product_price_date
          ) {
            res.status(200).json({
              status: 'ok',
              message:
                'Product specific data was successfully scraped and added to database',
              data: amazon_data,
            });
          } else {
            res.status(404).json({
              status: 'error',
              error: 'NOT FOUND',
              message:
                'Program tried to scrape product specific data but it didnt find any new data',
            });
          }
        }
      })
      .catch((err: AxiosError) => {
        axiosErrorHandler(err, res);
      });
  }
};

//Axios get request for api calling directly from server.
const getRequestWithAxios = async (url: string, params: any = null) => {
  const axiosResponse = await axios
    //If params are not null, program will send params to url
    .get(url, params ? { params } : {})
    .then(response => {
      return response;
    });
  return axiosResponse;
};
const axiosErrorHandler = (err: AxiosError, res: Response) => {
  //If the request was made and the server responded.
  if (err.response) {
    return res.status(err.response.status).json({
      error: err.response.statusText,
      headers: err.response.headers,
      data: err.response.data,
    });
  }
  //Else something happened in setting up the request that triggered an Error
  return res.status(500).json({
    error: '500 Internal Server Error',
    message: err.message,
  });
};

router.get('/', async (req: Request, res: Response) => {
  res.json(await AmazonProductData.find());
});
//Get product by name
router.get('/name/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  res.json(
    await AmazonProductData.find({
      product_name: { $regex: '^' + name, $options: 'i' },
    })
  );
});

router.get('/array', async (req: Request, res: Response) => {
  const { array }: any = req.query;
  const object_of_ids = array.map((id: string) => {
    return id;
  });
  res.json(
    await AmazonProductData.find({
      product_id: {
        $in: object_of_ids,
      },
    })
  );
});

//Get product by id
router.get('/id/:id', async (req: Request, res: Response) => {
  getAmazonProductData(req, res, AmazonProductData);
});

//Get details by id
router.get('/details/id/:id', async (req: Request, res: Response) =>
  getAmazonProductData(req, res, AmazonProductDetails)
);

//Get images by id
router.get('/images/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(
    req,
    res,
    AmazonProductThumbImages,
    'http://localhost:5000/api/as/id/'
  )
);

//Get product technical details by id
router.get('/technicalDetails/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(req, res, AmazonProductTechnicalDetails)
);

//Get product about by id
router.get('/about/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(req, res, AmazonProductAbout)
);
//Get product prices by id
router.get('/prices/id/:id', (req: Request, res: Response) =>
  getAmazonSpecificDataOrUpdateIfNeeded(
    req,
    res,
    AmazonProductPrices,
    'http://localhost:5000/api/as/prices/id/'
  )
);
//Get product reviews by id
router.get('/reviews/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(
    req,
    res,
    AmazonProductReviews,
    'http://localhost:5000/api/as/reviews/id/'
  )
);
//Get product high resolution images by id
router.get('/highResImages/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(
    req,
    res,
    AmazonProductHighResImages,
    'http://localhost:5000/api/as/highRes/id/'
  )
);

router.get('/updatePrices', async (req: Request, res: Response) => {
  //Get all product ids from /api/favourites/getAll
  getRequestWithAxios('http://localhost:5000/api/favourites/')
    .then(response => {
      //Run amazon scraper to update price for every product id found in /api/favourites/getAll
      getRequestWithAxios('http://localhost:5000/api/as/prices/array', {
        array: response.data.data,
      })
        .then(response => {
          res.status(200).json({
            status: 'ok',
            message: 'Prices updated',
            data: response.data,
          });
        })
        .catch((err: AxiosError) => {
          axiosErrorHandler(err, res);
        });
    })
    .catch((err: AxiosError) => {
      axiosErrorHandler(err, res);
    });
});
router.get('/sales/id/:id', async (req: Request, res: Response) => {
  //Get current date
  var yourDate = new Date();
  const current_date = new Date(
    yourDate.getTime() - yourDate.getTimezoneOffset() * 60 * 1000
  )
    .toISOString()
    .split('T')[0];

  let amazon_sales = await amazonProductSales.find({
    product_id: req.params.id,
  });
  if (
    amazon_sales.length > 0 &&
    amazon_sales[amazon_sales.length - 1].product_sales_date === current_date
  ) {
    return res.status(200).json({
      status: 'ok',
      message: 'Sales data was found in database',
      data: amazon_sales,
    });
  }
  //If there is no data for today, program will firstly scrape new reviews data from amazon, then update sales data
  getRequestWithAxios(
    'http://localhost:5000/api/as/reviews/id/' + req.params.id
  )
    .then(response => response.data)
    .then(responseData => {
      /*
      Becouse we don't have direct data about sales on Amazon, we will estimate it by using their reviews. 
      By different sources, we can estimate that 10% of customers who bought product will leave a review.
      Right now we are collecting reviews from 0 to 10 and from 40 to 50.
      That means we will get first review date(1) and last review date(50)
      So we will use this formula to estimate sales:
      (date_of_last_review - date_of_latest_review) + (current_date - date_of_last_review) = number_of_days_between_reviews
      Formula: 50 / number_of_days_beetween_dates * 10 = sales_per_day
      Ex. (07/07/2022 - 07/05/2021) + (09/07/2022 - 07/07/2022) = 50 / 63 * 10 = 7,93
      */
      if (responseData.status === 'ok') {
        axios
          .get('http://localhost:5000/api/ap/reviews/id/' + req.params.id)
          .then(response => response.data)
          .then(async responseData => {
            if (!responseData.data) {
              return res.status(200).json({
                status: 'ok',
                message: 'No reviews found',
              });
            }
            console.log(responseData.data);
            //sort json object by date
            const sortJsonObject = (a: any, b: any) => {
              return (
                new Date(a.product_rating_date).getTime() -
                new Date(b.product_rating_date).getTime()
              );
            };
            responseData.data.sort(sortJsonObject);
            const date_of_last_review = new Date(
              responseData.data[
                responseData.data.length - 1
              ].product_rating_date
            );

            const date_of_latest_review = new Date(
              responseData.data[0].product_rating_date
            );

            //Remove time, leave only date
            yourDate.setHours(0, 0, 0, 0);
            date_of_last_review.setHours(0, 0, 0, 0);
            date_of_latest_review.setHours(0, 0, 0, 0);

            const difference_between_dates =
              (date_of_last_review.getTime() -
                date_of_latest_review.getTime() +
                yourDate.getTime() -
                date_of_last_review.getTime()) /
              (1000 * 3600 * 24);
            const sales_per_day = (
              (50 / difference_between_dates) *
              10
            ).toFixed(2);
            await amazonProductSales.updateOne(
              {
                product_id: req.params.id,
                product_sales_date: current_date,
              },
              {
                product_id: req.params.id,
                product_sales: sales_per_day,
                product_sales_date: current_date,
              },
              { new: true, upsert: true }
            );
            amazon_sales = await amazonProductSales.find({
              product_id: req.params.id,
            });
            if (amazon_sales.length > 0)
              return res.status(200).json({
                status: 'ok',
                message: 'Product sales calculated!',
                data: amazon_sales,
              });
            return res.status(404).json({
              status: 'error',
              message: 'Product sales not found!',
            });
          });
      }
    });
});
export default router;
