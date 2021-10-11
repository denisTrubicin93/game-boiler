const axios = require('axios');

const API_KEY = 'CwCGbLxGjFBFanjHsENkK0VLeiZn50wx';
const API_SECRET = 'UaLw1-oUTOLdjsMTQI5mrdidt8b_k4-9';

const bodydetect = (imageBase64: string) => {
  const data = new FormData();
  data.append('api_key', API_KEY);
  data.append('api_secret', API_SECRET);
  data.append('image_base64', imageBase64);
  data.append('return_attributes', 'upper_body_cloth');
  const config = {
    baseURL: process.env.FACEPLUSPLUS_BASE_URL,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 8000,
  };
  return axios.post('/humanbodypp/v1/detect', data, config);
};

const facedetect = (imageBase64: string) => {
  const data = new FormData();
  data.append('api_key', API_KEY);
  data.append('api_secret', API_SECRET);
  data.append('image_base64', imageBase64);
  data.append('return_attributes', 'gender,age,smiling,facequality,beauty,mouthstatus,skinstatus');
  const config = {
    baseURL: process.env.FACEPLUSPLUS_BASE_URL,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 8000,
  };
  return axios.post('/facepp/v3/detect', data, config);
};

export { bodydetect, facedetect };
