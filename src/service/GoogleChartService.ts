const axios = require('axios');

const qrcodeChart = (data: string) => {
  return axios.get('/chart', {
    baseURL: process.env.GOOGLECHART_BASE_URL,
    params: {
      cht: 'qr',
      chs: '500x500',
      chco: '17ADE7',
      chl: data,
    },
    timeout: 8000,
    responseType: 'blob',
  });
};

export { qrcodeChart };
