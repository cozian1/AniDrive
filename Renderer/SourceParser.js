const Cheerio = require("cheerio");
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

export async function pullserver(episode_id,type='sub') {
  console.log('dd');
  let data = await fetch(
    BaseUrl + "/ajax/v2/episode/servers?episodeId=" + episode_id
  ).then((res) => res.json());

  const $ = Cheerio.load(data.html);
  const servers = [];
  $("div.server-item").each((i, el) => {
    servers.push({
      id: $(el).attr("data-id"),
      type: $(el).attr("data-type"),
      name: $(el).find("a.btn").text(),
    });
  });
  console.log(servers);

  for(let server of servers){
    if(type==server.type ){//&& ['MegaCloud','Vidstreaming'].includes(server.name)){
      data = await fetch(BaseUrl + "/ajax/v2/episode/sources?id=" + server.id).then((res) => res.json());
      server.serverId = data.link.split("?")[0].split("/").pop();
      return await MegacloudScrapper(server.serverId);
    }
  }
  for(let server of servers){
    if('raw'==server.type ){//&& ['MegaCloud','Vidstreaming'].includes(server.name)){
      data = await fetch(BaseUrl + "/ajax/v2/episode/sources?id=" + server.id).then((res) => res.json());
      server.serverId = data.link.split("?")[0].split("/").pop();
      return await MegacloudScrapper(server.serverId);
    }
  }
  return undefined;
}
export async function MegacloudScrapper(serverId){
  data = await fetch(Megacloud.mainUrl + Megacloud.embed + "?id=" + serverId).then((res) => res.json());
  const decryptKey = await fetch(Megacloud.key).then((res) => res.json());
  let sources = "";
  try {
    if (data.encrypted) {
      const encryptedURLTemp = data.sources?.split("");
      let key = "";

      for (const index of JSON.parse(decryptKey.key)) {
        for (let i = Number(index[0]); i < Number(index[1]); i++) {
          key += encryptedURLTemp[i];
          encryptedURLTemp[i] = "";
        }
      }
      sources = encryptedURLTemp.filter((x) => x !== "").join("");
      try {
        [sources] = JSON.parse(CryptoJS.AES.decrypt(sources, key).toString(CryptoJS.enc.Utf8));
      } catch (e) {
        console.error(e);
        sources = "";
      }
    }else{
      sources=JSON.parse(data?.sources);
    }
    const meta =await fetch(sources.file).then((res)=>res.text());
    const regex = /RESOLUTION=(\d+x\d+)[\s\S]*?\n(index[^\\n]+?\.m3u8)/g;
    let match;
    let vid=[{url:sources.file,quality:'auto'}];
    while ((match = regex.exec(meta)) !== null) {
      const resolution = match[1];
      const index = match[2];
      vid.push({
        url:sources.file.substring(0,sources.file.lastIndexOf('/')+1)+index ,
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
  } catch (err) {
    console.warn(err);
    return undefined;
  }
}

// let d=async ()=> console.log(await pullserver(106611,'sub'));
// d();
export async function getPlayableSources(EpisodeId) {
  //const data=await Promise.all([pullserver(EpisodeId,'sub'),pullserver(EpisodeId,'dub')]);
  let data=[];
  data.push(await pullserver(EpisodeId,'sub'));
  data.push(await pullserver(EpisodeId,'dub'));
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
//getPlayableSources(109143);