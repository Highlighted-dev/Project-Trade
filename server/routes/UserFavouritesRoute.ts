import bodyParser from 'body-parser';
import express, {
  application,
  Request,
  response,
  Response,
  Router,
} from 'express';
import userFavouritesModel from '../models/UserFavouritesModel';

const router: Router = express.Router();
const jsonParser = bodyParser.json();

declare module 'express-session' {
  export interface SessionData {
    user_favourites_product_ids: Array<any>;
  }
}

router.post('/add', jsonParser, async (req: Request, res: Response) => {
  try {
    await userFavouritesModel.create({
      user_id: req.body.user_id,
      product_id: req.body.product_id,
    });
    return res
      .status(200)
      .json({ status: 'success', message: 'Added to favourites!' });
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong when adding an item to favourites!',
    });
  }
});
router.post('/remove', jsonParser, async (req: Request, res: Response) => {
  try {
    await userFavouritesModel.deleteOne({
      user_id: req.body.user_id,
      product_id: req.body.product_id,
    });
    return res
      .status(200)
      .json({ status: 'success', message: 'Removed from favourites!' });
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong while removing item from favourites!',
    });
  }
});
router.post('/check', jsonParser, async (req: Request, res: Response) => {
  try {
    const userFavourites = await userFavouritesModel.findOne({
      user_id: req.body.user_id,
      product_id: req.body.product_id,
    });
    if (userFavourites) {
      return res
        .status(200)
        .json({ status: 'success', message: 'Item is in favourites!' });
    } else {
      return res
        .status(404)
        .json({ status: 'error', message: 'Item is not in favourites!' });
    }
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong when checking if item is in favourites!',
    });
  }
});
router.get('/get/:user_id', async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const userFavourites = await userFavouritesModel.find({
      user_id: user_id,
    });
    return res.status(200).json({ status: 'success', data: userFavourites });
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong when getting favourites!',
    });
  }
});
router.get('/getAll', async (req: Request, res: Response) => {
  try {
    // Get all product_id's in favourites without duplicates.
    const userFavourites = await userFavouritesModel
      .find()
      .distinct('product_id');
    req.session.user_favourites_product_ids = userFavourites;
    return res.status(200).redirect(req.session.url || '/');
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong when getting favourites!',
    });
  }
});
export default router;
