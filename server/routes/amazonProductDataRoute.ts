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
router.get('/as/detailed/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  /**
   * TODO: Run this only when theres no items with that id in database
   * */
  const { exec } = require('child_process');
  exec(
    'cd ../amazonscraper & scrapy crawl AmazonOneProductSpider -a prod_id="' +
      id +
      '"',
    (error: Error, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      } else {
        console.log(`stdout: ${stdout}`);
      }
    }
  );
});
export default router;
