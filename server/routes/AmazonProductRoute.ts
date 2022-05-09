import express, { Request, Response, Router } from 'express';
import AmazonProductData from '../models/AmazonProductDataModel';
import amazonProductDetails from '../models/AmazonProductDetailsModel';
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
  res.json(
    await amazonProductDetails.find({
      product_id: { $regex: '^' + id, $options: 'i' },
    })
  );
});
export default router;
