import {GroupedBarChartData} from './GroupedBarChart';

export const data: GroupedBarChartData = {
  labels: ['Chocolate', 'Vanilla', 'Strawberry'],
  datasets: [
    {
      legend: 'Blue',
      fillShadowGradientFrom: 'blue',
      fillShadowGradientTo: 'blue',
      data: [3, 7, 4],
    },
    {
      legend: 'Red',
      fillShadowGradientFrom: 'red',
      fillShadowGradientTo: 'red',
      data: [4, 3, 5],
    },
    {
      legend: 'Green',
      fillShadowGradientFrom: 'green',
      fillShadowGradientTo: 'green',
      data: [7, 2, 6],
    },
  ],
};

// will group [3, 4, 7]; [7, 3, 2]; [4, 5, 6]
