/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
import { useEffect, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../css/LineChart.css';
import { IChartItem } from '../../@types/LineChart';

ChartJS.register(...registerables);

const LineChart = ({ data, variable_type, settings }: any) => {
  // Becouse this component will use more than 1 type of json object, we need to change keys of the objects to fit the chart.
  const [chartData, setChartData] = useState(
    data.map(async (item: any) => {
      if (variable_type === 'prices') {
        item.labels = item.product_price_date;
        item.data = item.product_price;
      } else if (variable_type === 'sales') {
        item.labels = item.product_sales_date;
        item.data = item.product_sales;
      }
      return item;
    }),
  );

  const chartRef = useRef<ChartJS>(null);
  const options: any = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      easing: 'easeInOutQuad',
      duration: 520,
    },
    scales: {
      y: {
        gridLines: {
          color: '#111111',
          lineWidth: 1,
        },
      },
      x: {
        type: 'time',
        gridLines: {
          color: '#111111',
          lineWidth: 1,
        },
        time: {
          unit: 'day',
          tooltipFormat: 'dd/MM/yyyy',
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
    point: {
      backgroundColor: 'white',
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: '#1a1c20',
        borderWidth: 1,
        borderColor: '#000000',
        titleColor: '#fff',
        caretSize: 5,
        cornerRadius: 2,
        padding: 10,
      },
      legend: {
        position: 'bottom',
        reverse: true,
        labels: {
          color: '#808080',
        },
      },
      title: {
        display: true,
        text: settings.title,
        color: '#808080',
      },
    },
  };

  const getChartData = () => {
    const chart = chartRef.current;
    let gradient;
    if (chart) {
      const { ctx } = chart;
      gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, 'rgba(37, 34, 59,0.85)');
      gradient.addColorStop(0.5, 'rgba(37, 34, 59,0.5)');
      gradient.addColorStop(1, 'rgba(37, 34, 59,0.1)');
    }
    const chartDataSettings: any = {
      labels: chartData.map((product: IChartItem) => product.labels),
      datasets: [
        {
          label: settings.label,
          data: chartData.map((product: IChartItem) => product.data),
          pointBackgroundColor: 'rgba(255, 255, 255,0.9)',
          borderWidth: 1,
          borderColor: 'rgb(35, 35, 35)',
          backgroundColor: gradient || 'rgba(37, 34, 59,0.9)',
          fill: true,
        },
      ],
    };
    return chartDataSettings;
  };

  const getCurrentDate = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    const currentDate = new Date(date.getTime() - offset * 60 * 1000);
    return currentDate.toISOString().split('T')[0];
  };

  const getCurrentDateMinusWeek = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    const currentDate = new Date(date.getTime() - offset * 60 * 1000);
    currentDate.setDate(currentDate.getDate() - 6);
    return currentDate.toISOString().split('T')[0];
  };
  const filterDates = () => {
    // Delcraing new array for labels and data
    const data_array = [...data];
    // Sort the data_array by date
    data_array.sort((a, b) => {
      return a.labels.localeCompare(b.labels);
    });

    // Getting current chart
    const chart = chartRef.current;

    // Get current start and end date from inputs
    const start_date = document.getElementById(`start_date_${variable_type}`) as HTMLInputElement;
    const end_date = document.getElementById(`end_date_${variable_type}`) as HTMLInputElement;

    // If start date is not empty, filter dates_array to only include dates equal start date and end date
    if (start_date && chart) {
      // Get start date index and end date index from input provided by start_date and end_date
      const start_date_index = data_array
        .map((product: IChartItem) => product.labels)
        .indexOf(start_date.value);
      const end_date_index = data_array.map(product => product.labels).indexOf(end_date.value);
      // If there indexes are greater than -1 that means start and end dates are in dates_array
      // If start index is greater than end index, there isn't any date in dates_array that would match the start and end dates.
      if (start_date_index > -1 && end_date_index > -1 && start_date_index <= end_date_index) {
        // If start index is not equal to end index, there is more than one date in dates_array that would match the start and end dates.
        if (start_date_index !== end_date_index) {
          // Cut data_array to only include dates equal start date and end date
          data_array.splice(end_date_index + 1, data_array.length);
          data_array.splice(0, start_date_index);
          setChartData(data_array);
        } else {
          // Set chart data and lables to only one data point (Ex. If start date = "2022-08-04" and end date = "2022-08-04", only show "2022-08-04")
          setChartData(data_array.slice(start_date_index, end_date_index + 1));
        }

        chart.update();
        return;
      }
    }
    // If there are no data points beetwen start and end date, set chart data and labels to all dates (Ex. We have data for "2022-08-04" and "2022-08-06", but user requested data
    // for ""2022-08-05". Becouse we don't have that, we will show all data points
    setChartData(data_array);
  };
  useEffect(() => {
    filterDates();
  }, [data]);
  return (
    <div id="priceChart">
      <div id="chart">
        <Chart ref={chartRef} type="line" data={getChartData()} options={options} />
        <input
          type="date"
          id={`start_date_${variable_type}`}
          defaultValue={getCurrentDateMinusWeek()}
          onChange={() => filterDates()}
        />
        <input
          type="date"
          id={`end_date_${variable_type}`}
          defaultValue={getCurrentDate()}
          onChange={() => filterDates()}
        />
      </div>
    </div>
  );
};

export default LineChart;
