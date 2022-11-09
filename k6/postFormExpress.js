import http from "k6/http";

function generateRandom(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'p(99.99)', 'count'],
};


export default function () {
  const payload = JSON.stringify({
    URL: `http://${generateRandom(8)}.com`,
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post("http://localhost:7777", payload, params);
}
