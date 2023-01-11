import axios, { AxiosResponse } from 'axios';
import schedule from 'node-schedule';

interface IResponse {
  status: string;
  message: string;
  data: string;
}

const schedulePriceUpdate = schedule.scheduleJob('00 22 * * *', () => {
  axios
    .get('http://localhost:5000/api/ap/updatePrices')
    .then((response: AxiosResponse) => response.data)
    .then((responesData: IResponse) => {
      console.log(responesData.message);
    })
    .catch((error: Error) => {
      console.log(error.message);
    });
});

export default schedulePriceUpdate;
