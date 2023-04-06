import schedule from 'node-schedule';

const schedulePriceUpdate = schedule.scheduleJob({ hour: 24, minute: 1 }, () => {
  console.log('Updating prices...');
  // axios
  //   .get('http://localhost:5000/api/ap/updatePrices')
  //   .then((response: AxiosResponse) => response.data)
  //   .then((response_data: IResponse) => {
  //     console.log(response_data.message);
  //   })
  //   .catch((error: Error) => {
  //     console.log(error.message);
  //   });
});

export default schedulePriceUpdate;
