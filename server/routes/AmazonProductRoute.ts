import express, { Request, Response, Router } from 'express';
import AmazonProductData from '../models/AmazonProductDataModel';
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
router.get('/detailed/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  var amazon_product_detail = await AmazonProductData.find({
    product_name: { $regex: '^' + name, $options: 'i' },
  });
});
export default router;
