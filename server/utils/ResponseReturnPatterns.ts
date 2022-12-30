import { ICheckIfItemsExistInDbAndReturnResponse } from '../@types/ResponseReturnPatterns';

export const checkIfItemsExistInDbAndReturnResponse = ({
  res,
  searched_items_in_db_model,
  success_message,
  error_message,
  special_condition = true,
  custom_error_status_code = 404,
}: ICheckIfItemsExistInDbAndReturnResponse) => {
  if (searched_items_in_db_model.length > 0 && special_condition)
    return res.status(200).json({
      status: 'ok',
      message: success_message,
      data: searched_items_in_db_model,
    });
  return res.status(custom_error_status_code).json({
    status: 'error',
    message: error_message,
  });
};
