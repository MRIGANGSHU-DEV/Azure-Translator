const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

let key = process.env.AZURE_TRANSLATOR_API_KEY;
let endpoint = process.env.AZURE_TRANSLATOR_API_ENDPOINT;

// location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
let location = process.env.AZURE_TRANSLATOR_API_REGION;

let params = new URLSearchParams();
params.append("api-version", "3.0");
params.append("from", "en");
params.append("to", "sw");
params.append("to", "it");

axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
        'Ocp-Apim-Subscription-Key': key,
         // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
    },
    params: params,
    data: [{
        'text': 'Hello, friend! What did you do today?'
    }],
    responseType: 'json'
}).then(function(response){
    console.log(JSON.stringify(response.data, null, 4));
})