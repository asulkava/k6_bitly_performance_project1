import http from "k6/http";
import { sleep } from 'k6';

function generateRandom(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



export function setup() {
  // 2. setup code
  // save some urls so they are found
  const urls = Array(100).fill("").map(() => `http://${generateRandom(8)}.com`)
  let retUrls = []
  for (let i = 0; i < urls.length; i++) {
    const payload = JSON.stringify({
      URL: urls[i],
    });
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let response = http.post("http://localhost:7777", payload, params);
    retUrls[i] = "http://localhost:7777/" + JSON.parse(response.body).short_id
  }


  return { retUrls };

}

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'p(99.99)', 'count'],
};


export default function (data) {
  const dataLen = data.retUrls.length
  const url = data.retUrls[Math.floor(Math.random() * dataLen)]
  http.get(url,{redirects: 0});
}
