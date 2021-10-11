const axios = require('axios');

type OmikujiParams = {
  subcontentType?: string;
  blood?: string;
  birth?: string;
};

const OmikujiService = (params: OmikujiParams) => {
  return axios.get(
    `/apigw/mirror/contentspocket/blood-birth-test/${params.subcontentType}`,
    {
      baseURL: process.env.API_BASE_URL,
      params: {
        target: 1,
        blood: params.blood,
        birth: params.birth,
      },
      timeout: 8000,
      'Content-Type': 'application/xml; charset=utf-8',
      headers: {
        apiKey: 'dgVbeYHLlJZIhq4RsX0nEpg0w4twvTmf',
      },
    }
  );
};

export default OmikujiService;
