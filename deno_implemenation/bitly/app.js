import { serve, renderFile, configure } from "./deps.js";
import { shorten, getOriginalUrl, getRandomUrl } from "./services/urlService.js"

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};


const handleRequest = async (request) => {
  const url = new URL(request.url);
  const urlCode = url.pathname.split('/')[1]
  if (url.pathname === "/random" && request.method === "GET") {
    const random_url = await getRandomUrl()
    return Response.redirect(random_url, 307);
  }
  else if (urlCode.length > 5 && request.method === "GET") {
    if(urlCode == "favicon.ico"){
      return new Response(await renderFile('main.eta'), responseDetails)
    }
    else{
      const original_url = await getOriginalUrl(urlCode)
      return Response.redirect(original_url, 307);
    }
  }

  else if (url.pathname === "/" && request.method === "GET") {
    return new Response(await renderFile('main.eta'), responseDetails)
  }
  else if (url.pathname === "/" && request.method === "POST") {
    const formData = await request.formData()
    const urlToShorten = formData.get('URL')
    const data = await shorten(urlToShorten)
    return new Response(await renderFile('main.eta', data), responseDetails)
  }
  else {
    return new Response(await renderFile('main.eta'), responseDetails)
  }
};

serve(handleRequest, { port: 7777 });