import { generateRandom } from "../utils/urlUtil.js"
import { executeQuery } from "../database/database.js"
const shorten = async (url) => {
  const randomString = generateRandom(6)
  const randomUrl = "http://localhost:7777/" + randomString

  await addUrlToDatabase(url, randomString)
  const data = {
    original_url: url,
    shortened_url: randomUrl
  }
  return data
}

const addUrlToDatabase = async (original_url, shortened_url_code) => {
  await executeQuery("INSERT INTO urls (original_url,shortened_url_code) VALUES ($original_url,$shortened_url_code)", { original_url: original_url, shortened_url_code: shortened_url_code })
}

const fetchall = async () => {
  let ret = await executeQuery("SELECT * FROM urls ")
  //console.log(ret)
}


const getOriginalUrl = async (shortened_url_code) => {
  const res = await executeQuery(
    "SELECT original_url FROM urls WHERE shortened_url_code = $shortened_url_code;",
    { shortened_url_code: shortened_url_code },
  );
  return res.rows[0].original_url
}


export {
  shorten,
  getOriginalUrl
}