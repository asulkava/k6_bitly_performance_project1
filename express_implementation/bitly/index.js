const express = require('express')
const path = require('path');
const bodyParser=require("body-parser");
const Pool = require('pg').Pool

const app = express()
app.use(express.static("public"));
app.use(bodyParser.json());

const pool = new Pool();

const getRandomUrl = async () => {
  const res = await pool.query(
    "SELECT original_url FROM urls");
  return res.rows[Math.floor(Math.random() * (res.rows.length-1))].original_url
}

const getOriginalUrl = async (shortened_url_code) => {
  const res = await pool.query(
    "SELECT original_url FROM urls WHERE shortened_url_code = $1;",[shortened_url_code]
  );
  return res.rows[0].original_url
}

const addUrlToDatabase = async (original_url, shortened_url_code) => {
  const query = `INSERT INTO urls (original_url,shortened_url_code) VALUES ($1,$2)`
  await pool.query(query,[original_url,shortened_url_code])
}

function generateRandom(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get('/', (req, res) => {
  //console.log("main")
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(htmlPath);
});

app.post('/', async (req, res) => {

  const randomString = generateRandom(6)
  await addUrlToDatabase(req.body.URL, randomString)
  //console.log("Post", req.body.URL, randomString)

  res.json({
    original_url: req.body.URL,
    short_id: randomString
  })

});

app.get('/random', async (req, res) => {
  //console.log("rand")
  const random_url = await getRandomUrl()
  res.redirect(random_url)
});

app.get('/:short_id', async (req, res) => {
  //console.log("redirect", req.params.short_id)
  const original_url = await getOriginalUrl(req.params.short_id)
  res.redirect(original_url)
});

const port = 7777

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
