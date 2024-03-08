const Cheerio = require("cheerio");
//import CryptoJS from 'crypto-js';
//eas build -p android --profile preview
const CryptoJS = require("crypto-js");

let Megacloud = {
  name: "Megacloud",
  mainUrl: "https://megacloud.tv",
  embed: "/embed-2/ajax/e-1/getSources",
  key: "https://zoro.anify.tv/key/6", //"https://raw.githubusercontent.com/theonlymo/keys/e1/key",
};
let Dokicloud = {
  name: "Dokicloud",
  mainUrl: "https://dokicloud.one",
  embed: "/ajax/embed-4/",
  key: "https://raw.githubusercontent.com/theonlymo/keys/e4/key",
};
let Rabbitstream = {
  name: "Rabbitstream",
  mainUrl: "https://rabbitstream.net",
  embed: "/ajax/embed-4/",
  key: "https://raw.githubusercontent.com/theonlymo/keys/e4/key",
};
const BaseUrl = "https://hianime.to";

async function filterscraper() {
  try {
    const res = await fetch(url + "/filter");
    const data = await res.text();
    const $ = Cheerio.load(data);
    let d = [];
    let list = {};
    $("div.ni-list > div").each((i, el) => {
      d.push({
        id: $(el).attr("data-id"),
        name: $(el).text(),
      });
    });
    d.pop();
    list.genres = d;
    d = [];
    $("select[name='type'] > option").each((i, el) => {
      d.push({
        id: $(el).attr("value"),
        name: $(el).text(),
      });
    });
    list.Type = d;
    d = [];
    $("select[name='status'] > option").each((i, el) => {
      d.push({
        id: $(el).attr("value"),
        name: $(el).text(),
      });
    });
    list.Status = d;
    d = [];
    $("select[name='season'] > option").each((i, el) => {
      d.push({
        id: $(el).attr("value"),
        name: $(el).text(),
      });
    });
    list.Seasons = d;

    console.log(list);
  } catch (err) {
    console.log(err);
  }
}
function getPaths() {
  return {
    recently_updated: "/recently-updated",
    most_popular: "/most-popular",
    top_airing: "/top-airing",
    most_favorite: "/most-favorite",
    movie: "/movie",
  };
}

async function scrapePages(path, page = 1) {
  path=path.trim().replaceAll(' ','-');
  try {
    const res = await fetch(BaseUrl + path + "?page=" + page);
    const data = await res.text();
    let list = aniScraper(data);
    return list;
  } catch (err) {
    console.log("Failed to fetch " + path, err);
  }
}
function aniScraper(data) {
  const $ = Cheerio.load(data);
  let list = [];
  $("div.film_list-wrap > div").each((i, el) => {
    list.push({
      id: $(el).find("div.film-poster > a").attr("href").slice(1),
      Name: $(el).find("h3.film-name").text(),
      img: $(el).find("div.film-poster > img").attr("data-src"),
      type: $(el).find("span.fdi-item").first().text(),
    });
  });
  return list;
}
async function allscraper() {
  let paths=Object.values(getPaths());
  const fetchPromises = paths.map(path => fetch(BaseUrl + path + "?page=" + 1).then(res => res.text()).then(res => aniScraper(res)).catch(err=>console.log(err)));
  const response=await Promise.all(fetchPromises)//.then(res => {console.log(res[0]); return res;});
  const data={};
  for(let i in paths){
    data[paths[i].substring(1)]=response[i];
  }
  console.log(Object.keys(data));
}

//allscraper();