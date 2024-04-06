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

//var Buffer = require('buffer/').Buffer;
