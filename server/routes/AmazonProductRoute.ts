import express, { Request, Response, Router } from 'express';
import { Model } from 'mongoose';
import { AxiosError } from 'axios';
import amazonProductDataModel from '../models/AmazonProductDataModel';
import amazonProductDetailsModel from '../models/AmazonProductDetailsModel';
import amazonProductThumbImagesModel from '../models/AmazonProductThumbImagesModel';
import amazonProductTechnicalDetailsModel from '../models/AmazonProductTechnicalDetailsModel';
import amazonProductAboutModel from '../models/AmazonProductAboutModel';
import amazonProductHighResImagesModel from '../models/AmazonProductHighResImagesModel';
import amazonProductPricesModel from '../models/AmazonProductPricesModel';
import amazonProductReviewsModel from '../models/AmazonProductReviewsModel';
import { axiosErrorHandler, getRequestWithAxios } from '../utils/AxiosRequests';
import { checkIfItemsExistInDbAndReturnResponse } from '../utils/ResponseReturnPatterns';

const router: Router = express.Router();

const getAmazonProductData = async (
  // Request variable, Response variable, name of the model
  req: Request,
  res: Response,
  model_name: Model<any, any, any, any>,
  scraping_url = '',
) => {
  const { id } = req.params;
  let amazon_product_data = await model_name.find({
    product_id: id,
  });
  // If json is not empty that means program found data
  if (amazon_product_data.length > 0) {
    return res.status(200).json({
      status: 'ok',
      message: 'data found!',
      data: amazon_product_data,
    });
  }
  // If scraping url is set, program will try to scrape data. It will only be set for images(becouse every amazon product has at least 1 image) and highres images
  if (scraping_url.length > 0) {
    getRequestWithAxios(scraping_url + id)
      .then(async response => {
        if (response.status === 200) {
          amazon_product_data = await model_name.find({
            product_id: id,
          });
          return res.status(200).json({
            status: 'ok',
            message: 'Product data successfully scraped and added to database.',
            data: amazon_product_data,
          });
        }
        return res.status(500).json(response.data);
      })
      .catch((err: AxiosError) => {
        axiosErrorHandler(err, res);
      });
  } else {
    return res.status(204).json({ status: 'error', message: 'Couldnt find the data' });
  }
};

const getAmazonSpecificDataOrUpdateIfNeeded = async (
  req: Request,
  res: Response,
  model_name: Model<any, any, any, any>,
  scraping_url: string,
) => {
  const { id } = req.params;
  let amazon_data = await model_name.find({
    product_id: id,
  });

  // Getting current date (for checking if data is old)
  let yourDate = new Date();
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);

  if (
    // If program found data and today's date is equal to product_price_date of last update (Ex. 07/07/2022 (today) == 07/07/2022 (last update))
    amazon_data.length > 0 &&
    yourDate.toISOString().split('T')[0] === amazon_data[amazon_data.length - 1].product_price_date
  )
    res.status(200).json({
      status: 'ok',
      message: 'Product specific data found!',
      data: amazon_data,
    });
  else {
    getRequestWithAxios(scraping_url + id)
      .then(async response => {
        if (response.status === 200) {
          amazon_data = await amazonProductPricesModel.find({
            product_id: id,
          });
          return checkIfItemsExistInDbAndReturnResponse({
            res,
            searched_items_in_db_model: amazon_data,
            success_message: 'Product specific data was successfully scraped and added to database',
            error_message:
              'Program tried to scrape product specific data but it didnt find any new data',
            special_condition:
              yourDate.toISOString().split('T')[0] ===
              amazon_data[amazon_data.length - 1].product_price_date,
          });
        }
        return res
          .status(500)
          .json({ status: 'error', message: 'Something went wrong', data: response.data });
      })
      .catch((err: AxiosError) => {
        axiosErrorHandler(err, res);
      });
  }
};

router.get('/', async (req: Request, res: Response) => {
  res.json(await amazonProductDataModel.find());
});
router.get('/id/', async (req: Request, res: Response) => {
  return res.json(await amazonProductDataModel.find().distinct('product_id'));
});

// Get product by name
router.get('/name/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  const data = await amazonProductDataModel.find({
    product_name: { $regex: `^${name}`, $options: 'i' },
  });
  return res.json(data);
});

router.get('/array', async (req: Request, res: Response) => {
  const { array }: any = req.query;
  if (!array) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing array parameter',
    });
  }
  const object_of_ids = array.map((id: string) => {
    return id;
  });
  return res.json(
    await amazonProductDataModel
      .find({
        product_id: {
          $in: object_of_ids,
        },
      })
      .sort({ product_name: 1 }),
  );
});

// Get product by id
router.get('/id/:id', async (req: Request, res: Response) => {
  getAmazonProductData(req, res, amazonProductDataModel);
});

// Get details by id
router.get('/details/id/:id', async (req: Request, res: Response) =>
  getAmazonProductData(req, res, amazonProductDetailsModel),
);

// Get images by id
router.get('/images/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(req, res, amazonProductThumbImagesModel, 'http://localhost:5000/api/as/id/'),
);

// Get product technical details by id
router.get('/technicalDetails/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(req, res, amazonProductTechnicalDetailsModel),
);

// Get product about by id
router.get('/about/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(req, res, amazonProductAboutModel),
);
// Get product prices by id
router.get('/prices/id/:id', (req: Request, res: Response) =>
  getAmazonSpecificDataOrUpdateIfNeeded(
    req,
    res,
    amazonProductPricesModel,
    'http://localhost:5000/api/as/prices/id/',
  ),
);
// Get product reviews by id
router.get('/reviews/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(
    req,
    res,
    amazonProductReviewsModel,
    'http://localhost:5000/api/as/reviews/id/',
  ),
);
// Get product high resolution images by id
router.get('/highResImages/id/:id', (req: Request, res: Response) =>
  getAmazonProductData(
    req,
    res,
    amazonProductHighResImagesModel,
    'http://localhost:5000/api/as/highRes/id/',
  ),
);

router.get('/updatePrices', async (req: Request, res: Response) => {
  getRequestWithAxios('http://localhost:5000/api/as/prices/')
    .then(response => {
      res.status(200).json({
        status: 'ok',
        message: 'Prices updated',
        data: response.data,
      });
    })
    .catch((err: AxiosError) => {
      axiosErrorHandler(err, res);
    })
    .catch((err: AxiosError) => {
      axiosErrorHandler(err, res);
    });
});

export default router;
