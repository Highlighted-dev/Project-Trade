import axios, { AxiosError } from 'axios';
import { Response } from 'express';

export const getRequestWithAxios = async (url: string, params: any = null) => {
  const axiosResponse = await axios
    //If params are not null, program will send params to url
    .get(url, params ? { params } : {})
    .then(response => {
      return response;
    });
  return axiosResponse;
};
export const axiosErrorHandler = (err: AxiosError, res: Response) => {
  //If the request was made and the server responded.
  if (err.response) {
    return res.status(err.response.status).json({
      error: err.response.statusText,
      headers: err.response.headers,
      data: err.response.data,
    });
  }
  //Else something happened in setting up the request that triggered an Error
  return res.status(500).json({
    error: '500 Internal Server Error',
    message: err.message,
  });
};
