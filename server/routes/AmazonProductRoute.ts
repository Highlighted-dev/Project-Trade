import express, { Request, Response, Router } from 'express';
import AmazonProductData from '../models/AmazonProductDataModel';
import AmazonProductDetails from '../models/AmazonProductDetailsModel';
import AmazonProductThumbImages from '../models/AmazonProductThumbImagesModel';
import AmazonProductTechnicalDetails from '../models/AmazonProductTechnicalDetailsModel';
import AmazonProductAbout from '../models/AmazonProductAboutModel';
import AmazonProductHighResImages from '../models/AmazonProductHighResImagesModel';
import session from 'express-session';
import { Model } from 'mongoose';

//Session variables interface for typescript
declare module 'express-session' {
  export interface SessionData {
    url: string;
  }
}
const router: Router = express.Router();
router.get('/', async (req: Request, res: Response) => {
  res.json(await AmazonProductData.find());
});
//Get product by id
router.get('/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await AmazonProductData.findById(id));
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
//Check for product data
router.get('/checkProduct/id/:id', async (req: Request, res: Response) =>
  isProductDataAlreadyInDatabase(req, res)
);
//Get details by id
router.get('/details/id/:id', async (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductDetails)
);
//Get images by id
router.get('/images/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductThumbImages)
);
//Get technical details by id
router.get('/technicalDetails/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductTechnicalDetails)
);
router.get('/about/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductAbout)
);
router.get('/highResImages/id/:id', (req: Request, res: Response) =>
  getAmazonHighResImages(req, res)
);

const getAmazonDetailedData = async (
  //Request variable, Response variable, name of the model, if program should search for another data
  req: Request,
  res: Response,
  modelName: Model<any, any, any, any>
) => {
  const { id } = req.params;
  const amazon_product_detailed_data = await modelName.find({
    product_id: id,
  });
  //If json is not empty that means program found data
  if (amazon_product_detailed_data.length > 3) {
    res.status(200).json(amazon_product_detailed_data);
  } else {
    //Program didn't find any data, but it's okay becouse sometimes there isn't this type of data on Amazon
    res.status(204).send();
  }
};

//On Amazon, every product has at least 1 image. So If there are no images it means that there isn't any data about the product in database.
const isProductDataAlreadyInDatabase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const amazon_product_detailed_data = await AmazonProductThumbImages.find({
    product_id: id,
  });
  //If json is not empty that means program found data
  if (amazon_product_detailed_data.length > 3) {
    res.status(200).send();
  }
  //In case if amazon scraper didn't find any items
  else if (req.session.url == req.originalUrl) {
    res.status(404).send();
  } else {
    //Store current url in express sessions
    req.session.url = req.originalUrl;
    res.redirect('/api/as/id/' + id);
  }
};

const getAmazonHighResImages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const amazon_product_highres_images = await AmazonProductHighResImages.find({
    product_id: id,
  });
  if (amazon_product_highres_images.length > 3) {
    res.status(200).send(amazon_product_highres_images);
  }
  //In case if amazon scraper didn't find any items
  else if (req.session.url == req.originalUrl) {
    res.status(404).send();
  } else {
    //Store current url in express sessions
    req.session.url = req.originalUrl;
    res.redirect('/api/as/highRes/id/' + id);
  }
};
export default router;
