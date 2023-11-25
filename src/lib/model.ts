export interface ScrapeResultData {
    title: string; // 专辑名
    artist: string[];
    genre: string[];
    year: string;
    descr: string;
    tracks: string[];
    cover: string;
  }
  
export interface ScrapeResult {
    status: number; // 是否获取成功
    data: ScrapeResultData;
    url: string;
}

export interface QueryModel {
    url: string
}
