import { pullserver } from "./SourceParser";

const Cheerio = require("cheerio");

const BaseUrl = "https://hianime.to";

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

export async function scrapePages(path, page = 1) {
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

export async function scrapeSearch(keyword,page=1) {
  console.log(keyword);
  let list =[];
  if (keyword.trim()=='') return list;
  try {
    const res = await fetch(BaseUrl + '/search?keyword='+keyword + "&page=" + page)
    const data=await res.text();
    list = aniScraper(data);
    return list;
  } catch (err) {
    console.log("Failed to fetch " + path, err);
  }
  return list;
}

export function getPaths() {
  return {
    top_airing: "/top-airing",
    recently_updated: "/recently-updated",
    most_favorite: "/most-favorite",
    most_popular: "/most-popular",
    movie: "/movie",
  };
}

export async function allscraper() {
  let paths=Object.values(getPaths());
  const fetchPromises = paths.map(path => fetch(BaseUrl + path + "?page=" + 1).then(res => res.text()).then(res => aniScraper(res)).catch(err=>console.log(err)));
  const response=await Promise.all(fetchPromises)//.then(res => {console.log(res[0]); return res;});
  const data={};
  for(let i in paths){
    data[paths[i].substring(1)]=response[i];
  }
  return data;
}

export async function scrapeSlider() {
  try {
    const res = await fetch(BaseUrl + "/home");
    const data = await res.text();
    const $ = Cheerio.load(data);
    let list = [];
    $(" div.swiper-wrapper > div").each((i, el) => {
      list.push({
        id: `${$(el).find("div.desi-buttons > a.btn-secondary").attr("href")}`.slice(1),
        name: $(el).find("div.desi-head-title").text(),
        src: $(el).find("div.deslide-cover-img > img").attr("data-src"),
        type: $(el).find("div.scd-item").first().text().trim(),
        spot: $(el).find("div.desi-sub-text").text().trim(),
        date: $(el).find("div.m-hide").text().trim(),
      });
    });
    list.splice(9);
    return list;
  } catch (err) {
    console.log("Failed to Fetch slider", err);
  }
}

export async function getadditionals(Id) {
  try {
    const res = await fetch(BaseUrl+Id);
    const data = await res.text();
    const $ = Cheerio.load(data);
    let map = new Map();
    let skip1 = [
      "",
      "Genres:",
      "Studios:",
      "Producers:",
      "Overview:",
      "Japanese:",
    ];
    $("div.anisc-info > div").each((i, el) => {
      if (!skip1.includes($(el).find("span.item-head").text())) {
        map.set(
          $(el).find("span.item-head").text().slice(0, -1).replace(" ", "_"),
          $(el).find("span.name").text()
        );
      }
      if ($(el).find("span.item-head").text() == "Genres:") {
        let l = [];
        $(el)
          .find("a")
          .each((j, o) => {
            l.push($(o).text());
          });
        map.set("Genres", l);
      }
      if ($(el).find("span.item-head").text() == "Studios:") {
        let l = [];
        $(el)
          .find("a")
          .each((j, o) => {
            l.push($(o).text());
          });
        map.set("Studios", l);
      }
    });
    let list = [];
    $("div.film_list-wrap > div").each((i, el) => {
      list.push({
        id: $(el).find("div.film-poster > a").attr("href").slice(1),
        Name: $(el).find("h3.film-name").text(),
        img: $(el).find("div.film-poster > img").attr("data-src"),
        type: $(el).find("span.fdi-item").first().text(),
      });
    });
    map.set("Recomendation", list);
    const info = Object.fromEntries(map);
    return info;
  } catch (err) {
    console.log("Failed to fetch addtionals", err);
  }
}

export async function getEpisodeData(id) {
  const url = "https://consumet-nu-jet.vercel.app/anime/zoro/watch?";
  const servers = ["vidcloud", "vidstreaming", "streamsb", "streamtape"];
  let data;
  try {
    for (let i of servers) {
      const host = `${url}episodeId=${id}&server=${i}`;
      const res = await fetch(host);
      data = await res.json();
      if (data.message == undefined) {
        break;
      }
    }
    return data!=undefined?data:{};
  } catch (e) {
    console.log("fetching episode error", e);
  }
}
/**
@depriciated
 */
export async function getAnimedataOld(Id) {
  try {
    Id=Id.replace('watch/','');
    const res = await fetch(BaseUrl+'/'+Id);
    const data = await res.text();

    const $ = Cheerio.load(data);
    let map = new Map();
    let { mal_id, anilist_id ,anime_id} = JSON.parse($('#syncData').text());
    if(anilist_id==''){
      //anilist_id= await getAniListId(mal_id).catch((e)=>console.log(e));
    }
    let skip= [
      "",
      "Genres:",
      "Studios:",
      "Producers:",
      "Overview:",
      "Japanese:",
    ];
    let kept=[
      "Genres:",
      "Studios:",
      "Producers:",
    ];
    $("div.anisc-info > div").each((i, el) => {
      if (!skip.includes($(el).find("span.item-head").text())) {
        map.set(
          $(el).find("span.item-head").text().slice(0, -1).replace(" ", "_"),
          $(el).find("span.name").text()
        );
      }
      if (kept.includes($(el).find("span.item-head").text())) {
        let l = [];
        $(el)
          .find("a")
          .each((j, o) => {
            l.push($(o).text());
          });
        map.set($(el).find("span.item-head").text().slice(0, -1), l);
      }
    });
    let recomend = [];
    $("div.film_list-wrap > div").each((i, el) => {
      recomend.push({
        id: $(el).find("div.film-poster > a").attr("href").slice(1),
        Name: $(el).find("h3.film-name").text(),
        img: $(el).find("div.film-poster > img").attr("data-src"),
        type: $(el).find("span.fdi-item").first().text(),
      });
    });
    let list=[];
    $('div.os-list > a').each((i,el)=>{
      list.push({
        id:$(el).attr('href').slice(1),
        name:$(el).text().trim(),
        title:$(el).attr('title'),
        src:$(el).find('div.season-poster').attr('style').slice(22,-2)
      })
    });
    map.set("Relation",list);
    map.set("Recomendation", recomend);
    const info = Object.fromEntries(map);
    info.malID = Number(mal_id);
    info.alID = Number(anilist_id);
    info.image = $('img.film-poster-img').attr('src');
    info.description = $('div.film-description').text().trim();
    info.title = $("div.anisc-detail > h2.dynamic-name").text();
    info.jpname=$("div.anisc-detail > h2.dynamic-name").attr('data-jname');
    info.type = $('span.item').last().prev().prev().text().toUpperCase();

    let episodes=await fetch(BaseUrl+'/ajax/v2/episode/list/'+anime_id).then((res)=>res.json());

    const $$ =  Cheerio.load(episodes.html);

      info.totalEpisodes = $$('div.detail-infor-content > div > a').length;
      info.episodes = [];
      $$('div.detail-infor-content > div > a').each((i, el) => {
        info.episodes?.push({
          episode_id:$$(el).attr("data-id"),
          id: $$(el).attr('href'),
          number: parseInt($$(el).attr('data-number')),
          title: $$(el).attr('title'),
          isFiller: $$(el).hasClass('ssl-item-filler'),
          AniId:anilist_id,
        });
      });
    return info;
  } catch (err) {
    console.warn("Failed to fetch info", err);
  }
}


export async function getAnimeInfo(Id) {
  try {
    Id=Id.replace('watch/','');
    const res = await fetch(BaseUrl+'/'+Id);
    const data = await res.text();

    const $ = Cheerio.load(data);
    let map = new Map();
    let { mal_id, anilist_id ,anime_id} = JSON.parse($('#syncData').text());
    
    const query = `
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          id
          title {
            romaji
            english
          }
          description
          status
          format
          episodes
          trailer {
            id
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          streamingEpisodes {
            title
            thumbnail
          }
          genres
          averageScore
        }
      }
`;
    let variables = {id: mal_id};
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json','Accept': 'application/json',},
        body: JSON.stringify({query: query,variables: variables})
    };
    const [anilistdata,episodes]= await Promise.all([ fetch('https://graphql.anilist.co', options).then(res=>res.json().then(json=> res.ok ? json.data.Media:undefined)).catch(err => console.warn(err)), fetch(BaseUrl+'/ajax/v2/episode/list/'+anime_id).then((res)=>res.json())]);
    
    let skip= [
      "",
      "Genres:",
      "Studios:",
      "Producers:",
      "Overview:",
      "Japanese:",
    ];
    let kept=[
      "Genres:",
      "Studios:",
      "Producers:",
    ];
    $("div.anisc-info > div").each((i, el) => {
      if (!skip.includes($(el).find("span.item-head").text())) {
        map.set(
          $(el).find("span.item-head").text().slice(0, -1).replace(" ", "_"),
          $(el).find("span.name").text()
        );
      }
      if (kept.includes($(el).find("span.item-head").text())) {
        let l = [];
        $(el)
          .find("a")
          .each((j, o) => {
            l.push($(o).text());
          });
        map.set($(el).find("span.item-head").text().slice(0, -1), l);
      }
    });
    let recomend = [];
    $("div.film_list-wrap > div").each((i, el) => {
      recomend.push({
        id: $(el).find("div.film-poster > a").attr("href").slice(1),
        Name: $(el).find("h3.film-name").text(),
        img: $(el).find("div.film-poster > img").attr("data-src"),
        type: $(el).find("span.fdi-item").first().text(),
      });
    });
    let Relation=[];
    $('div.os-list > a').each((i,el)=>{
      Relation.push({
        id:$(el).attr('href').slice(1),
        name:$(el).text().trim(),
        title:$(el).attr('title'),
        src:$(el).find('div.season-poster').attr('style').slice(22,-2)
      })
    });
    map.set("Relation",Relation);
    map.set("Recomendation", recomend);
    const info = Object.fromEntries(map);
    info.malID = Number(mal_id);
    info.alID = anilistdata ? anilistdata.id:Number(anilist_id);
    info.image = anilistdata ? anilistdata.coverImage:{extraLarge:$('img.film-poster-img').attr('src'),large:$('img.film-poster-img').attr('src'),medium:$('img.film-poster-img').attr('src')};
    info.description = anilistdata ? anilistdata.description:$('div.film-description').text().trim();
    info.title = anilistdata ? anilistdata.title.english:$("div.anisc-detail > h2.dynamic-name").text();
    info.jpname=anilistdata ? anilistdata.title.romaji:$("div.anisc-detail > h2.dynamic-name").attr('data-jname');
    info.type = anilistdata ? anilistdata.format:$('span.item').last().prev().prev().text().toUpperCase();
    anilistdata ? info.MAL_Score=parseFloat(anilistdata.averageScore)/10:null;

    let episodedata= new Map();
    if(anilistdata)
    anilistdata?.streamingEpisodes?.forEach(e => {
      episodedata.set(Number(e.title.split(' ')[1]),e.thumbnail)
    });
    const $$ =  Cheerio.load(episodes.html);
    info.episodes = [];
    $$('div.detail-infor-content > div > a').each((i, el) => {
      info.episodes?.push({
        episode_id:$$(el).attr("data-id"),
        AniId:info.alID,
        id: $$(el).attr('href'),
        number: parseInt($$(el).attr('data-number')),
        title: $$(el).attr('title'),
        isFiller: $$(el).hasClass('ssl-item-filler'),
        img:episodedata.has(parseInt($$(el).attr('data-number')))?episodedata.get(parseInt($$(el).attr('data-number'))):info.image.medium
      });
    });
    info.totalEpisodes = [info.episodes.length,anilistdata? anilistdata.episodes : '?'].join('/');
    return info;
  } catch (err) {
    console.warn("Failed to fetch info", err);
  }
}

export async function getStreams(Details,type='sub') {
  const url=`https://api.anify.tv/sources?providerId=zoro&watchId=${Details.id}&episodeNumber=${Details.number}&id=${Details.AniId}&subType=`;
  let data=await fetch(url+'sub').then((res)=>res.json()).catch((e)=>{console.warn('ERROR IN SOURCE FETCH')});
  data.dub=await fetch(url+'dub').then((res)=>res.json()).catch((e)=>{console.warn('ERROR IN SOURCE FETCH')});
  if(data.error && data.dub.error){
    throw 'error in fetching source'+url+'sub';
  }else if(data.error){
    data.audio=data.dub.audio;
    data.headers=data.dub.headers;
    data.intro=data.dub.intro;
    data.outro=data.dub.outro;
    data.subtitles=[];
  }
  for(i in data?.subtitles){
    if(data.subtitles[i].lang=='Thumbnails'){
      data.subtitles.splice(i, 1);
      break;
    }
  }
  if(data.sources){
    for(i=0;i<data.sources.length;i++){
      if(!data.sources[i].url.endsWith('.m3u8')){
        data.sources.splice(i, 1);
        i--;
      }
    }
    let x=data.sources?.pop();
    data.sources.unshift(x);
  }
  if(data.dub.sources){
    for(i=0;i<data.dub.sources.length;i++){
      if(!data.dub.sources[i].url.endsWith('.m3u8')){
        data.dub.sources.splice(i, 1);
        i--;
      }
    }
    let x=data.dub.sources.pop();
    data.dub.sources.unshift(x);
  }

  const Response={
    "audio":data.audio,
    "headers": data.headers,
    "intro": data.intro,
    "outro": data.outro,
    "subtitles":data.subtitles,
    "sub":data.error?[]:data.sources,
    "dub":data.dub.error?[]:data.dub.sources
  }
  return Response;
}