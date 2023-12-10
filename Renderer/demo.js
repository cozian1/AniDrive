const Cheerio = require("cheerio");
//import CryptoJS from 'crypto-js';
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
const BaseUrl = "https://aniwatch.to";

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