import express, { Request, Response, Router } from 'express';
import amazonProductData from '../models/amazonProductDataModel';

const router: Router = express.Router();

router.get('/as', async (req: Request, res: Response) => {
  res.json(await amazonProductData.find());
});
//Get product by id
router.post('/as/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await amazonProductData.findById(id));
});
//Get product by name
router.post('/as/name/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  res.json(
    await amazonProductData.find({
      product_name: { $regex: '^' + name, $options: 'i' },
    })
  );
});
export default router;
