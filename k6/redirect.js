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
  let res = http.get("http://localhost:7777");
  for (let i = 0; i < urls.length; i++) {
    let response = res.submitForm({
      formSelector: 'form',
      fields: { URL: urls[i] },
    });
    // hack to get shortened uri from html
    let bodyString = response.body.toString()
    let urlPart = bodyString.split('id="shortened"')[1]
    let urlInd1 = urlPart.indexOf('"')
    let urlInd2 = urlPart.lastIndexOf('"')
    let url = urlPart.slice(urlInd1+1,urlInd2)
    retUrls[i] = url
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
  //console.log(url)
  http.get(url,{redirects: 0});
}
