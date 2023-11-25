import index from "./index.html";
import {resolveAM} from "./lib/apple_music";
import { Buffer } from 'buffer';
import { QueryModel } from "./lib/model";

export default {
  async fetch(request: Request, env: any, ctx: any) {
    return await handle(request);
  },
};

async function handle(request: Request) : Promise<Response> {
  let response: Response;
  try {
    let url = new URL(request.url);
    if (url.pathname === '/') {
      console.log(url.pathname === '/' || url.search === '');
      response = await makeHTMLResponse(index);
    } else {
      if (request.method === 'POST' 
          && request.body !== null 
          && request.body !== undefined 
          && url.pathname === '/api/search') {
      }
      const body = (await request.json()) as QueryModel;
      const resp = await getAm(body.url);
      const data = await resolveAM(resp, body.url);
      response = await makeJSONResponse(data);
    }
  } catch (e) {
    console.log(e);
    response = await makeJSONResponse({
      'status': 100
    }); 
  }
  return response;
}

async function readBody(requestBody: ReadableStream<any>) : Promise<string> {
  const chunks = [];
  for await (const chunk of requestBody) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString();
}

async function makeHTMLResponse(body: string) : Promise<Response> {
  return new Response(body, {
    headers: {
      'content-type': 'text-html'
    }
  })
}

async function makeJSONResponse(body: object) : Promise<Response> {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json'
    }
  })
}

async function getAm(url: string) : Promise<string> {
  let data = await fetch(url)
  let json = await data.text()
  console.log(url);
  return json;
}



