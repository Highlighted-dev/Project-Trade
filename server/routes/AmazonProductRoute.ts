import express, { Request, Response, Router } from 'express';
import AmazonProductData from '../models/AmazonProductDataModel';
import AmazonProductDetails from '../models/AmazonProductDetailsModel';
import AmazonProductImages from '../models/AmazonProductImagesModel';
import AmazonProductTechnicalDetails from '../models/AmazonProductTechnicalDetailsModel';
import session from 'express-session';
import { Model } from 'mongoose';
import amazonProductImages from '../models/AmazonProductImagesModel';

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
//Get details by id
router.get('/details/id/:id', async (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductDetails)
);
//Get images by id
router.get('/images/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, amazonProductImages)
);
//Get technical details by id
router.get('/technicalDetails/id/:id', (req: Request, res: Response) =>
  getAmazonDetailedData(req, res, AmazonProductTechnicalDetails)
);

const getAmazonDetailedData = async (
  req: Request,
  res: Response,
  modelName: Model<any, any, any, any>
) => {
  const { id } = req.params;
  const amazon_product_detailed_data = await modelName.find({
    product_id: id,
  });
  //If json is empty
  if (amazon_product_detailed_data.length > 3) {
    res.json(amazon_product_detailed_data);
  } else {
    //Store current url in express sessions
    req.session.url = req.originalUrl;
    res.redirect('/api/as/id/' + id);
  }
};
export default router;
