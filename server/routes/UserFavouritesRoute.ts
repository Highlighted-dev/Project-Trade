import bodyParser from 'body-parser';
import express, { Request, Response, Router } from 'express';
import userFavouritesModel from '../models/UserFavouritesModel';
import { checkIfItemsExistInDbAndReturnResponse } from '../utils/ResponseReturnPatterns';

const router: Router = express.Router();
const jsonParser = bodyParser.json();

const errorHandler = (err: any, res: Response) => {
  if (err instanceof Error)
    return res.status(400).json({
      status: 'error',
      error: 'BAD REQUEST',
      message: err.message,
      logs: err.stack,
    });
  return res.status(400).json({
    status: 'error',
    error: 'BAD REQUEST',
    message: 'Error message was not provided.',
  });
};

//Add a new favourite item to the user
router.post('/', jsonParser, async (req: Request, res: Response) => {
  try {
    if (!req.body.product_id || !req.body.user_id) {
      throw new Error('Request values cannot be null');
    }
    await userFavouritesModel.create({
      user_id: req.body.user_id,
      product_id: req.body.product_id,
    });
    return res
      .status(200)
      .json({ status: 'ok', message: 'Added to favourites!' });
  } catch (err) {
    errorHandler(err, res);
  }
});

//Remove favourite item from the database
router.delete('/', jsonParser, async (req: Request, res: Response) => {
  try {
    if (!req.body.product_id || !req.body.user_id) {
      throw new Error('Request values cannot be null');
    }
    await userFavouritesModel.deleteOne({
      user_id: req.body.user_id,
      product_id: req.body.product_id,
    });
    return res
      .status(200)
      .json({ status: 'ok', message: 'Removed from favourites!' });
  } catch (err) {
    errorHandler(err, res);
  }
});

//Check if the user has a favourite item with the given product id
router.get(
  '/check/:user_id/:product_id',
  jsonParser,
  async (req: Request, res: Response) => {
    try {
      const { product_id, user_id } = req.params;
      if (!product_id || !user_id) {
        throw new Error('Request values cannot be null');
      }
      const userFavourites = await userFavouritesModel.find({
        user_id: user_id,
        product_id: product_id,
      });
      return checkIfItemsExistInDbAndReturnResponse({
        res,
        searched_items_in_db_model: userFavourites,
        success_message: 'Item is in the favourites.',
        error_message: 'Item is not in the favourites!',
        //If item is not in the favourites its ok so we return 200 status code
        custom_error_status_code: 200,
      });
    } catch (err) {
      errorHandler(err, res);
    }
  }
);
//Get all favourites of a user
router.get('/:user_id?', async (req: Request, res: Response) => {
  const { user_id } = req.params;
  if (!user_id) {
    var userFavourites = await userFavouritesModel
      .find()
      .distinct('product_id');
    return res.status(200).json({ status: 'ok', data: userFavourites });
  }
  try {
    userFavourites = await userFavouritesModel.find({
      user_id: user_id,
    });
    return res.status(200).json({ status: 'ok', data: userFavourites });
  } catch (err) {
    errorHandler(err, res);
  }
});

export default router;
