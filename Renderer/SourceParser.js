//import Cheerio from "cheerio";
//import CryptoJS  from"crypto-js";
import { MegaCloud } from "../Extractors/MegaCloud";
import { KaidoRapidCloud } from "../Extractors/KaidoRapidCloud";
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

export async function pullserver(episode_id,type='sub',mode=0) {
  let response;
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
      response= mode==0?await KaidoRapidCloud.Extract(server.serverId):await MegaCloud.Extract(server.serverId);
      if(response){
        return response;
      }
    }
  }
  return mode==0?await pullserver(episode_id,type,1):undefined;
}

export async function getPlayableSources(EpisodeId) {
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


//pullserver(109143,'dub');