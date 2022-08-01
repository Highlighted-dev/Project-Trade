import { useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
ChartJS.register(...registerables);

const LineChart = ({ data, labels }: any) => {
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
          color: 'rgba(200, 200, 200, 0.2)',
          lineWidth: 1,
        },
      },
      x: {
        type: 'time',
        gridLines: {
          color: 'rgba(200, 200, 200, 0.15)',
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
        tension: 0.4,
      },
    },
    point: {
      backgroundColor: 'white',
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(37, 34, 59,0.9)',
        borderWidth: 1,
        borderColor: 'rgb(0, 0, 0)',
        titleColor: '#fff',
        caretSize: 5,
        cornerRadius: 2,
        padding: 10,
      },
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Price history',
        color: 'rgba(0, 0, 0,0.9)',
      },
    },
  };
  const getChartData: any = () => {
    const chart = chartRef.current;
    var gradient;
    if (chart) {
      const ctx = chart.ctx;
      gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, 'rgba(37, 34, 59,0.8)');
      gradient.addColorStop(0.5, 'rgba(37, 34, 59,0.5)');
      gradient.addColorStop(1, 'rgba(37, 34, 59,0.1)');
    }
    const chartData: any = {
      labels: labels,
      datasets: [
        {
          label: 'Price',
          data: data,
          pointBackgroundColor: 'rgba(255, 255, 255,0.9)',
          borderWidth: 1,
          borderColor: 'rgb(35, 35, 35)',
          backgroundColor: gradient,
          fill: true,
        },
      ],
    };
    return chartData;
  };
  return (
    <>
      <Chart ref={chartRef} type="line" data={getChartData()} options={options} />
    </>
  );
};

export default LineChart;
