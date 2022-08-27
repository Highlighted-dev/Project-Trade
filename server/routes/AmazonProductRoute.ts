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

//Session variables interface for typescript

const router: Router = express.Router();
router.get('/', async (req: Request, res: Response) => {
  res.json(await AmazonProductData.find());
});
//Check for product data
router.get('/checkProduct/id/:id', async (req: Request, res: Response) =>
  isProductDataAlreadyInDatabase(req, res)
);
//Get product by name
router.get('/name/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  res.json(
    await AmazonProductData.find({
      product_name: { $regex: '^' + name, $options: 'i' },
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
  getAmazonProductData(req, res, AmazonProductThumbImages)
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
//Get product high resolution images by id
router.get('/highResImages/id/:id', (req: Request, res: Response) =>
  getAmazonHighResImages(req, res)
);

router.get('/updatePrices', async (req: Request, res: Response) => {
  //Get all product ids from /api/favourites/getAll
  getRequestWithAxios('http://localhost:5000/api/favourites/getAll')
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

const getAmazonProductData = async (
  //Request variable, Response variable, name of the model, if program should search for another data
  req: Request,
  res: Response,
  modelName: Model<any, any, any, any>
) => {
  const { id } = req.params;
  const amazon_product_data = await modelName.find({
    product_id: id,
  });
  //If json is not empty that means program found data
  if (amazon_product_data.length > 0) {
    res.status(200).json({
      status: 'ok',
      message: 'items found!',
      data: amazon_product_data,
    });
  } else {
    //Program didn't find any data, but it's okay becouse sometimes there isn't this type of data on Amazon
    res.status(200).json([{}]);
  }
};

//On Amazon, every product has at least 1 image. So If there are no images it means that there isn't any data about the product in database.
const isProductDataAlreadyInDatabase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const amazon_product_data = await AmazonProductThumbImages.find({
    product_id: id,
  });
  //If amazon_product_data is not empty that means program found data
  if (amazon_product_data.length > 2) {
    res.status(200).json({ status: 'ok', message: 'Product Data found' });
  } else {
    //If program didn't found data, it will try to scrape it with amazons scraper.
    getRequestWithAxios('http://localhost:5000/api/as/id/' + id)
      .then(response => {
        if (response.status == 200) {
          res.status(200).json({
            status: 'ok',
            message: 'Product data successfully scraped and added to database.',
            data: response.data,
          });
        }
      })
      .catch((err: AxiosError) => {
        axiosErrorHandler(err, res);
      });
  }
};

const getAmazonHighResImages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const amazon_product_highres_images = await AmazonProductHighResImages.find({
    product_id: id,
  });

  if (amazon_product_highres_images.length > 2) {
    res.status(200).json({
      status: 'ok',
      message: 'Highres images found!',
      data: amazon_product_highres_images,
    });
  } else {
    //If program didn't found data, it will try to scrape it with amazons scraper.
    getRequestWithAxios('http://localhost:5000/api/as/highRes/id/' + id)
      .then(async response => {
        if (response.status == 200) {
          const amazon_product_highres_images =
            await AmazonProductHighResImages.find({
              product_id: id,
            });

          if (amazon_product_highres_images.length > 2) {
            res.status(200).json({
              status: 'ok',
              message:
                'Product data successfully scraped and added to database.',
              data: amazon_product_highres_images,
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
export default router;
