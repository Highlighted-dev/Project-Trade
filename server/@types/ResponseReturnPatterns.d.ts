import { Response } from 'express';

export interface ICheckIfItemsExistInDbAndReturnResponse {
  res: Response;
  searched_items_in_db_model: any[];
  success_message: string;
  error_message: string;
  special_condition?: boolean;
  custom_error_status_code?: number;
}
