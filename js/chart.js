export const chartOptions = {

  title: {
      text: 'График температуры воздуха на ближайшие 12 часов'
  },

  subtitle: {
      text: 'Openweathermap'
  },

  yAxis: {
      title: {
          text: 'Температура воздуха'
      }
  },

  xAxis: {
      type: 'datetime'
  },

  legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
  },

  // plotOptions: {
  //     series: {
  //         label: {
  //             connectorAllowed: false
  //         },
  //         pointStart: 2010
  //     }
  // },

  series: [{
      name: '°C',
      data: [[1607695200, 129.9],
      [1607698800, 71.5],
      [1607702400, 106.4]]
  }],

  responsive: {
      rules: [{
          condition: {
              maxWidth: 500
          },
          chartOptions: {
              legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
              }
          }
      }]
  }

}


// Highcharts.chart('container', {

//   title: {
//       text: 'График температуры воздуха на ближайшие 12 часов'
//   },

//   subtitle: {
//       text: 'Openweathermap'
//   },

//   yAxis: {
//       title: {
//           text: 'Температура воздуха'
//       }
//   },

//   xAxis: {
//       type: 'datetime'
//   },

//   legend: {
//       layout: 'vertical',
//       align: 'right',
//       verticalAlign: 'middle'
//   },

//   // plotOptions: {
//   //     series: {
//   //         label: {
//   //             connectorAllowed: false
//   //         },
//   //         pointStart: 2010
//   //     }
//   // },

//   series: [{
//       name: '°C',
//       data: [[1607695200, 129.9],
//       [1607698800, 71.5],
//       [1607702400, 106.4]]
//   }],

//   responsive: {
//       rules: [{
//           condition: {
//               maxWidth: 500
//           },
//           chartOptions: {
//               legend: {
//                   layout: 'horizontal',
//                   align: 'center',
//                   verticalAlign: 'bottom'
//               }
//           }
//       }]
//   }

// });