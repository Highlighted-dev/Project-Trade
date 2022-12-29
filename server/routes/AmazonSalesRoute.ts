import axios from 'axios';
import express, { Request, Response, Router } from 'express';
import amazonProductSalesModel from '../models/AmazonProductSalesModel';
import { getRequestWithAxios } from '../utils/AxiosRequests';
import { checkIfItemsExistInDbAndReturnResponse } from '../utils/ResponseReturnPatterns';

const router: Router = express.Router();

/*
    We will get average date of latest reviews and last reviews For this we will use "for" loop to iterate through every item in the list,
    and add date of every item to the variable "average_number_of__days_beetwen_latest_review".
    Then we will divide this variable by number of items in the list.
    Ex. We have 20 reviews in total, we will get average date of 10 latest reviews, and the other 10 to get the average date of 10 last reviews.
 */
const getTheAverageDate = (array: any, start_from: number) => {
  let average_date_as_number = 0;
  for (let i = start_from; i < array.length / 2 + start_from; i++) {
    average_date_as_number += new Date(array[i].product_rating_date).getTime();
  }
  const one_day = 1000 * 60 * 60 * 24;
  const average_date = new Date(
    Math.round(average_date_as_number / (array.length / 2) / one_day) * one_day
  );
  return average_date;
};

const getDateWithCorrectOffset = (date: Date) => {
  date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return date;
};

const formatCurrentDate = (date: Date) => {
  const current_date = date.toISOString().split('T')[0];
  return current_date;
};

const calculateDifferenceBetweenDates = (
  latest_date: Date,
  last_date: Date,
  current_date: Date
) => {
  const difference_between_dates =
    (last_date.getTime() -
      latest_date.getTime() +
      current_date.getTime() -
      last_date.getTime()) /
    (1000 * 3600 * 24);
  return difference_between_dates;
};

const calculateSalesPerDay = (difference_between_dates: number) => {
  const sales_per_day = ((50 / difference_between_dates) * 10).toFixed(2);
  return sales_per_day;
};

router.get('/id/:id', async (req: Request, res: Response) => {
  //Get current date
  var yourDate = getDateWithCorrectOffset(new Date());
  const formatted_current_date = formatCurrentDate(yourDate);
  yourDate.setHours(0, 0, 0, 0);

  let amazon_sales = await amazonProductSalesModel.find({
    product_id: req.params.id,
  });
  if (
    amazon_sales.length > 0 &&
    amazon_sales[amazon_sales.length - 1].product_sales_date ===
      formatted_current_date
  ) {
    return res.status(200).json({
      status: 'ok',
      message: 'Sales data was found in database',
      data: amazon_sales,
    });
  }
  //If there is no data for today, program will firstly scrape new reviews data from amazon, then update sales data
  getRequestWithAxios(
    'http://localhost:5000/api/as/reviews/id/' + req.params.id
  )
    .then(response => response.data)
    .then(responseData => {
      /*
        Becouse we don't have direct data about sales on Amazon, we will estimate it by using their reviews. 
        By different sources, we can estimate that 10% of customers who bought product will leave a review.
        Right now we are collecting reviews from 0 to 10 and from 40 to 50.
        That means we will get average date of first 10 reviews(1-10) and average date of last 10 reviews (41-50).
        So we will use this formula to estimate sales:
        (last_average_date - latest_average_date) + (current_date - last_average_date) = number_of_days_between_reviews
        Formula: 50 / number_of_days_beetween_dates * 10 = sales_per_day
        Ex. (07/07/2022 - 07/05/2021) + (09/07/2022 - 07/07/2022) = 50 / 63 * 10 = 7,93
        */
      if (responseData.status === 'ok') {
        axios
          .get('http://localhost:5000/api/ap/reviews/id/' + req.params.id)
          .then(response => response.data)
          .then(async responseData => {
            if (!responseData.data) {
              return res.status(200).json({
                status: 'ok',
                message: 'No reviews found',
              });
            }
            //sort json object by date
            const sortJsonObject = (a: any, b: any) => {
              return (
                new Date(a.product_rating_date).getTime() -
                new Date(b.product_rating_date).getTime()
              );
            };
            responseData.data.sort(sortJsonObject);

            const latest_average_date = getTheAverageDate(responseData.data, 0);
            const last_average_date = getTheAverageDate(
              responseData.data,
              responseData.data.length / 2
            );

            const sales_per_day = calculateSalesPerDay(
              calculateDifferenceBetweenDates(
                latest_average_date,
                last_average_date,
                yourDate
              )
            );

            await amazonProductSalesModel.updateOne(
              {
                product_id: req.params.id,
                product_sales_date: formatted_current_date,
              },
              {
                product_id: req.params.id,
                product_sales: sales_per_day,
                product_sales_date: formatted_current_date,
              },
              { new: true, upsert: true }
            );
            amazon_sales = await amazonProductSalesModel.find({
              product_id: req.params.id,
            });
            return checkIfItemsExistInDbAndReturnResponse(
              res,
              amazon_sales,
              'Product sales calculated!',
              'Product sales not found!'
            );
          });
      }
    });
});
export default router;
