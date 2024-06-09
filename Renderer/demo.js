//import Cheerio from "cheerio";
//import CryptoJS  from"crypto-js";

const Cheerio = require("cheerio");
const CryptoJS = require("crypto-js");

const BaseUrl =[
  {
    host:"https://kaido.to",
    server:'/ajax/episode/servers?episodeId=',
    sources:'/ajax/episode/sources?id=',
  },{
    host:'https://hianime.to',
    server:'/ajax/v2/episode/servers?episodeId=',
    sources:'/ajax/v2/episode/sources?id=',
  }
];

async function pullserver(episode_id,type='sub',mode=0) {
  let response;
  try{
  let data = await fetch(BaseUrl[mode].host + BaseUrl[mode].server + episode_id).then((res) => res.json()).catch(err => {throw 'error in getting server list call-mode:'+mode});
  const $ = Cheerio.load(data.html);
  const servers = [];
  $("div.server-item").each((i, el) => {
    servers.push({
      id: $(el).attr("data-id"),
      type: $(el).attr("data-type"),
      name: $(el).find("a.btn").text(),
    });
  });
  for(let server of servers){
    if([type,'raw'].includes(server.type)){//&& ['MegaCloud','Vidstreaming'].includes(server.name)){
      data = await fetch(BaseUrl[mode].host + BaseUrl[mode].sources + server.id).then((res) => res.json()).catch(err => {throw 'error in getting iframe server code call-mode:'+mode});
      server.serverId = data.link.split("?")[0].split("/").pop();
      response= mode==0?await KaidoRapidCloud.Extract(server.serverId).catch(()=>console.log('me-error')):await MegaCloud.Extract(server.serverId);
      if(response){
        console.log(response);
        return response;
      }
      break;
    }
  }
}catch(e){
  console.log(e);
}
  //return mode==0?await pullserver(episode_id,type,1):undefined;
}

async function getPlayableSources(EpisodeId) {
  const data=await Promise.all([pullserver(EpisodeId,'sub'),pullserver(EpisodeId,'dub')]);
  const sub=data[0]?data[0].sources:[];
  const dub=data[1]?data[1].sources:[];
  const subtitle=data[0]?data[0].subtitles:data[1]?data[1].subtitles:[];
  const intro=data[0]?data[0].intro:data[1]?.intro;
  const outro=data[0]?data[0].outro:data[1]?.outro;
  const Response={
    "intro": intro,
    "outro": outro,
    "subtitles":subtitle,
    "sub":sub,
    "dub":dub,
  }
  return Response;
}


//pullserver(109143,'sub',1);






class MegaCloud {
  static name = "Megacloud";
  static mainUrl = "https://megacloud.tv";
  static embed = "/embed-2/ajax/e-1/getSources";
  static key = "https://zoro.anify.tv/key/6";
  static altKey = "https://raw.githubusercontent.com/theonlymo/keys/e1/key";
  static script = "https://megacloud.tv/js/player/a/prod/e1-player.min.js";
  static sources = "https://megacloud.tv/embed-2/ajax/e-1/getSources?id=";
  static keyStore='HiAnime_key';
  static refreshKey=false;

  static async Extract(id) {
    console.log('MegaCloud');
    try {
      console.log(this.sources + id);
      const data = await fetch(this.sources + id, {
        headers: {
          Accept: "*/*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Referer: 'https://hianime.to',
        }
      }).then((res) => res.json()).catch((err)=> console.log('fetch Error',err));

      const decrypted =data.encrypted?JSON.parse(await this.decrypt(data.sources))[0]:data.sources[0];

      const meta =await fetch(decrypted.file).then((res)=>res.text());
      const regex = /RESOLUTION=(\d+x\d+)[\s\S]*?\n(index[^\\n]+?\.m3u8)/g;
      let match;
      let vid=[{url:decrypted.file,quality:'auto'}];
      while ((match = regex.exec(meta)) !== null) {
        const resolution = match[1];
        const index = match[2];
        vid.push({
          url:decrypted.file.substring(0,decrypted.file.lastIndexOf('/')+1)+index ,
          quality:resolution.split('x').pop()+'P'
        });
      }
      data.sources=vid;
      data.subtitles=[];
      data?.tracks?.filter((val)=> val.kind=='captions').forEach(val => {data.subtitles.push({url:val.file,lang:val.label})});
      delete data.tracks;
      delete data.encrypted;
      delete data.server;

      return data;
    }catch (err) {
      console.warn(err);
      return undefined;
    }
  }

  static async extractVariables() {
    const text = await fetch(this.script,{cache: "no-cache"}).then((res) => res.text());
    const regex = /case\s*0x[0-9a-f]+:(?![^;]*=partKey)\s*\w+\s*=\s*(\w+)\s*,\s*\w+\s*=\s*(\w+);/g;
    const matches = Array.from(text.matchAll(regex));
    const indexPairs = matches.map(match => {
      const var1 = match[1];
      const var2 = match[2];

      const regexVar1 = new RegExp(`,${var1}=((?:0x)?([0-9a-fA-F]+))`);
      const regexVar2 = new RegExp(`,${var2}=((?:0x)?([0-9a-fA-F]+))`);

      const matchVar1 = text.match(regexVar1);
      const matchVar2 = text.match(regexVar2);

      if (matchVar1 && matchVar2) {
          const value1 = parseInt(matchVar1[1].replace("0x", ""), 16);
          const value2 = parseInt(matchVar2[1].replace("0x", ""), 16);
          return [value1, value2];
      } else {
          return [];
      }
      }).filter(pair => pair.length > 0);
    return indexPairs;
  }

  static async getSecret(encryptedString,indexPairs) {
    let secret, encryptedSource;
    const result = indexPairs.reduce((accumulator, item) => {
        const start = item[0] + accumulator.third;
        const end = start + item[1];
        const passSubstr = encryptedString.substring(start, end);
        const passPart = accumulator.first + passSubstr;
        const cipherPart = accumulator.second.replace(passSubstr, "");
        return {
            first: passPart,
            second: cipherPart,
            third: accumulator.third + item[1]
        };
    }, { first: "", second: encryptedString, third: 0 });
    encryptedSource=result.second;
    secret=result.first;
    return {encryptedSource,secret};
  }

  static async decrypt(encryptedString) {
    let indexPairs =[[0,0]];
    if(this.refreshKey){
      indexPairs = await this.extractVariables();
    }else{
      indexPairs=indexPairs?indexPairs:await this.extractVariables();
    }
    this.refreshKey=!this.refreshKey;
    const { secret, encryptedSource } =await this.getSecret(encryptedString,indexPairs);
    console.log('key',secret);
    let decrypted=CryptoJS.AES.decrypt(encryptedSource, secret).toString(CryptoJS.enc.Utf8);
    if(decrypted==''){
      decrypted=this.decrypt(encryptedString);
    }
    return decrypted;
  }
}

class KaidoRapidCloud {
  static name = "RapidCloud";
  static mainUrl = "https://rapid-cloud.co";
  static embed = "/ajax/embed-6-v2/getSources?id=";
  static script = "https://rapid-cloud.co/js/player/prod/e6-player-v2.min.js";
  static keyStore='Kaido_key';
  static refreshKey=false;

  static async Extract(id) {
    console.log('KaidoRapidCloud');
    try {
      const data = await fetch(this.mainUrl+this.embed+ id, {
        headers: {
          Accept: "*/*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Referer: 'https://kaido.to',
        },
      }).then((res) => res.json());

      const decrypted =data.encrypted?JSON.parse(await this.decrypt(data.sources))[0]:data.sources[0];

      const meta =await fetch(decrypted.file).then((res)=>res.text());
      const regex = /RESOLUTION=(\d+x\d+)[\s\S]*?\n(index[^\\n]+?\.m3u8)/g;

      let match;
      let vid=[{url:decrypted.file,quality:'auto'}];
      while ((match = regex.exec(meta)) !== null) {
        const resolution = match[1];
        const index = match[2];
        vid.push({
          url:decrypted.file.substring(0,decrypted.file.lastIndexOf('/')+1)+index ,
          quality:resolution.split('x').pop()+'P'
        });
      }
      data.sources=vid;
      data.subtitles=[];
      data?.tracks?.filter((val)=> val.kind=='captions').forEach(val => {data.subtitles.push({url:val.file,lang:val.label})});
      delete data.tracks;
      delete data.encrypted;
      delete data.server;

      return data;
    }catch (err) {
      console.warn(err);
      return undefined;
    }
  }

  static async extractVariables() {
    const text = await fetch(this.script,{cache: "no-cache"}).then((res) => res.text());
    const regex = /case\s*0x[0-9a-f]+:(?![^;]*=partKey)\s*\w+\s*=\s*(\w+)\s*,\s*\w+\s*=\s*(\w+);/g;
    const matches = Array.from(text.matchAll(regex));
    const indexPairs = matches.map(match => {
      const var1 = match[1];
      const var2 = match[2];

      const regexVar1 = new RegExp(`,${var1}=((?:0x)?([0-9a-fA-F]+))`);
      const regexVar2 = new RegExp(`,${var2}=((?:0x)?([0-9a-fA-F]+))`);

      const matchVar1 = text.match(regexVar1);
      const matchVar2 = text.match(regexVar2);

      if (matchVar1 && matchVar2) {
          const value1 = parseInt(matchVar1[1].replace("0x", ""), 16);
          const value2 = parseInt(matchVar2[1].replace("0x", ""), 16);
          return [value1, value2];
      } else {
          return [];
      }
      }).filter(pair => pair.length > 0);
    return indexPairs;
  }

  static async getSecret(encryptedString,indexPairs) {
    let secret, encryptedSource;
    const result = indexPairs.reduce((accumulator, item) => {
        const start = item[0] + accumulator.third;
        const end = start + item[1];
        const passSubstr = encryptedString.substring(start, end);
        const passPart = accumulator.first + passSubstr;
        const cipherPart = accumulator.second.replace(passSubstr, "");
        return {
            first: passPart,
            second: cipherPart,
            third: accumulator.third + item[1]
        };
    }, { first: "", second: encryptedString, third: 0 });
    encryptedSource=result.second;
    secret=result.first;
    return {encryptedSource,secret};
  }

  static async decrypt(encryptedString) {
    let indexPairs =[[0,0]];
    if(this.refreshKey){
      indexPairs = await this.extractVariables();
    }else{
      indexPairs=indexPairs?indexPairs:await this.extractVariables();
    }
    this.refreshKey=!this.refreshKey;
    const { secret, encryptedSource } =await this.getSecret(encryptedString,indexPairs);
    console.log('key',secret);
    let decrypted=CryptoJS.AES.decrypt(encryptedSource, secret).toString(CryptoJS.enc.Utf8);
    if(decrypted==''){
      decrypted=this.decrypt(encryptedString);
    }
    return decrypted;
  }
}
