import axios from 'axios';
import { Response } from 'express';

export const checkIfItemsExistInDbAndReturnResponse = (
  res: Response,
  searched_items_in_db_model: any[]
) => {
  if (searched_items_in_db_model.length > 0)
    return res.status(200).json({
      status: 'ok',
      message: 'Product sales calculated!',
      data: searched_items_in_db_model,
    });
  return res.status(404).json({
    status: 'error',
    message: 'Product sales not found!',
  });
};
