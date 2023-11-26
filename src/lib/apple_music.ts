import * as cheerio from 'cheerio';
import { ScrapeResult, ScrapeResultData } from "./model";

export async function resolveAM(body: string, url: string) : Promise<ScrapeResult> {
    const $ = cheerio.load(body);
    let info_json = JSON.parse($('script[id="schema:music-album"]').text().trim());
    let descr = $('p[data-testid="truncate-text"]').text().trim();
    let scrape: ScrapeResult = {
      'status': 200,
      'url': url,
      'data': {
        'title': info_json['name'] !== undefined ? info_json['name'] : '',
        'artist': makeNewArr(info_json['byArtist']),
        'genre': info_json['genre'] !== undefined ? info_json['genre'] : [], 
        'descr': descr,
        'year': info_json['datePublished'] !== undefined ? info_json['datePublished'] : '',
        'tracks': makeNewArr(info_json['tracks']),
        'cover': info_json['image'] !== undefined ? info_json['image'] : ''

      }
    };
    console.log(scrape);
    return scrape;
}

export async function getAm(url: string) : Promise<string> {
    console.log(url);
    console.log(url.replace(/\?i=\d+?/, ""))
    let data = await fetch(url.replace(/\?i=\d+?$/, ""))
    let json = await data.text()
    return json;
  }
  
// 只保留数组的指定元素
function makeNewArr(arr: [], save_name: string = 'name'): string[] {
    let data : string[] = [];
    if (arr === undefined) {
        return data; 
    }
    arr.map(i => {
        data.push(i[save_name]);
    })
    return data;
}
export default {
    "resolveAM": resolveAM
}