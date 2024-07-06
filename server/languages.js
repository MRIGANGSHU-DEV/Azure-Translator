const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();
var endpoint = process.env.AZURE_TRANSLATOR_API_ENDPOINT;


axios({
        method: 'GET',
        baseURL: endpoint,
        url: 'languages',
        params: {
          'api-version': '3.0',
        },
        headers: {
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data.translation, null, 4));
}).catch(err => {console.log(err)})


