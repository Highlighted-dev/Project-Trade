import express, { Request, Response, Router } from 'express';
import amazonProductSalesModel from '../models/AmazonProductSalesModel';
import { getRequestWithAxios } from '../utils/AxiosRequests';

const router: Router = express.Router();

const getDateWithCorrectOffset = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
};

const formatCurrentDate = (date: Date) => {
  const current_date = date.toISOString().split('T')[0];
  return current_date;
};

router.get('/id/:id', async (req: Request, res: Response) => {
  // Get current date
  const yourDate = getDateWithCorrectOffset(new Date());
  const formatted_current_date = formatCurrentDate(yourDate);
  yourDate.setHours(0, 0, 0, 0);

  let amazon_sales = await amazonProductSalesModel.find({
    product_id: req.params.id,
  });
  if (
    amazon_sales.length > 0 &&
    amazon_sales[amazon_sales.length - 1].product_sales_date === formatted_current_date
  ) {
    return res.status(200).json({
      status: 'ok',
      message: 'Sales data was found in database',
      data: amazon_sales,
    });
  }
  // If there is no data for today, program will try to scrape new sales data from amazon
  getRequestWithAxios(`http://localhost:5000/api/as/sales/id/${req.params.id}`)
    .then(response => response.data)
    .then(async response_data => {
      if (response_data.status !== 'ok') {
        return res.status(500).json({
          status: 'error',
          message: "Couldn't scrap the files",
          logs: response_data.logs,
        });
      }
      amazon_sales = await amazonProductSalesModel.find({
        product_id: req.params.id,
      });
      if (
        amazon_sales.length > 0 &&
        amazon_sales[amazon_sales.length - 1].product_sales_date === formatted_current_date
      ) {
        return res.status(200).json({
          status: 'ok',
          message: 'Sales data was found in database',
          data: amazon_sales,
        });
      }
      return res.status(404).json({
        status: 'error',
        message: 'Sales data was not found in database',
      });
    });
});
export default router;
