import axios from 'axios';
import { Response } from 'express';

export const checkIfItemsExistInDbAndReturnResponse = (
  res: Response,
  searched_items_in_db_model: any[],
  success_message: string,
  error_message: string,
  special_condition: boolean = true
) => {
  if (searched_items_in_db_model.length > 0 && special_condition)
    return res.status(200).json({
      status: 'ok',
      message: success_message,
      data: searched_items_in_db_model,
    });
  return res.status(404).json({
    status: 'error',
    message: error_message,
  });
};
