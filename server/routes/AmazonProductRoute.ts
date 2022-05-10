import express, { Request, Response, Router } from 'express';
import AmazonProductData from '../models/AmazonProductDataModel';
import AmazonProductDetails from '../models/AmazonProductDetailsModel';
import AmazonProductImages from '../models/AmazonProductImagesModel';
import AmazonProductTechnicalDetails from '../models/AmazonProductTechnicalDetailsModel';

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
router.get('/details/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(
    await AmazonProductDetails.find({
      product_id: id,
    })
  );
});
router.get('/images/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(
    await AmazonProductImages.find({
      product_id: id,
    })
  );
});
router.get('/technicalDetails/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(
    await AmazonProductTechnicalDetails.find({
      product_id: id,
    })
  );
});
export default router;
