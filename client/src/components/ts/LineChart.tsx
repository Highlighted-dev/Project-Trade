import { useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
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
          color: 'rgba(200, 200, 200, 0.08)',
          lineWidth: 1,
        },
      },
      x: {
        gridLines: {
          color: 'rgba(200, 200, 200, 0.05)',
          lineWidth: 1,
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
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(178, 34, 34,0.4)',
        titleColor: '#B22222',
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
      },
    },
  };
  const getChartData: any = () => {
    const chart = chartRef.current;
    var gradient;
    if (chart) {
      const ctx = chart.ctx;
      gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    }
    const chartData: any = {
      labels: labels,
      datasets: [
        {
          label: 'Price',
          data: data,
          pointBackgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#911215',
          backgroundColor: gradient,
          fill: true,
        },
      ],
      title: {
        display: true,
        text: 'Price',
        fontSize: 20,
        fontColor: '#911215',
      },
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
