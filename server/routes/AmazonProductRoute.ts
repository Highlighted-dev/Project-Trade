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
import AmazonProductReviews from '../models/AmaoznProductReviews';

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

const getAmazonPrice = async (req: Request, res: Response) => {
  const { id } = req.params;
  var amazon_prices = await AmazonProductPrices.find({
    product_id: id,
  });

  //Getting current date (for checking if data is old)
  var yourDate = new Date();
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
  if (
    //If program found data and today's date is equal to product_price_date of last update (Ex. 07/07/2022 (today) == 07/07/2022 (last update))
    amazon_prices.length > 0 &&
    yourDate.toISOString().split('T')[0] ==
      amazon_prices[amazon_prices.length - 1].product_price_date
  )
    res.status(200).json({
      status: 'ok',
      message: 'Product prices found!',
      data: amazon_prices,
    });
  else {
    getRequestWithAxios('http://localhost:5000/api/as/prices/id/' + id)
      .then(async response => {
        if (response.status == 200) {
          amazon_prices = await AmazonProductPrices.find({
            product_id: id,
          });
          //If program succesfuly scraped new data and then found them in database
          if (
            amazon_prices.length > 0 &&
            yourDate.toISOString().split('T')[0] ==
              amazon_prices[amazon_prices.length - 1].product_price_date
          ) {
            res.status(200).json({
              status: 'ok',
              message:
                'Product price was successfully scraped and added to database',
              data: amazon_prices,
            });
          } else {
            res.status(404).json({
              status: 'error',
              error: 'NOT FOUND',
              message:
                'Program tried to scrape product price but it didnt find any new data',
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
      //If program found data, program will return it further
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
  getAmazonPrice(req, res)
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

export default router;
