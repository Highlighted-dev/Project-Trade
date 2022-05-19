import express, { Request, Response, Router } from 'express';
import AmazonProductData from '../models/AmazonProductDataModel';
import AmazonProductDetails from '../models/AmazonProductDetailsModel';
import AmazonProductImages from '../models/AmazonProductImagesModel';
import AmazonProductTechnicalDetails from '../models/AmazonProductTechnicalDetailsModel';
import AmazonProductAbout from '../models/AmazonProductAboutModel';
import session from 'express-session';
import { Model } from 'mongoose';

//Session variables interface for typescript
declare module 'express-session' {
  export interface SessionData {
    url: string;
  }
}
const router: Router = express.Router();
var try_to_scrape_data: boolean = true;
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
//Get details by id
router.get('/details/id/:id', async (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductDetails)
);
//Get images by id
router.get('/images/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductImages)
);
//Get technical details by id
router.get('/technicalDetails/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductTechnicalDetails)
);
router.get('/about/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductAbout)
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
  } else if (try_to_scrape_data) {
    //Store current url in express sessions
    req.session.url = req.originalUrl;
    //Go to amazon scraper endpoint
    res.redirect('/api/as/id/' + id);
    try_to_scrape_data = false;
  } else {
    try_to_scrape_data = true;
    res.status(404).json('[]');
  }
};
export default router;
