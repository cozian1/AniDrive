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
    episodes
    nextAiringEpisode {
      timeUntilAiring
      episode
    }
    studios {
      edges {
        node {
          name
          isAnimationStudio
        }
      }
    }
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

// Define our query variables and values that will be used in the query request
let variables = {id: 15125};

const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json','Accept': 'application/json',},
    body: JSON.stringify({query: query,variables: variables})
};

fetch('https://graphql.anilist.co', options).then(res=>res.json().then(json=> res.ok ? json.data.Media:{})).catch(err => console.warn(err));



async function getAnimeInfo(Id) {
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
    info.totalEpisodes = $$('div.detail-infor-content > div > a').length+'/'+anilistdata ? anilistdata?.episodes:' ? ';
    info.episodes = [];
    $$('div.detail-infor-content > div > a').each((i, el) => {
      info.episodes?.push({
        episode_id:$$(el).attr("data-id"),
        id: $$(el).attr('href'),
        number: parseInt($$(el).attr('data-number')),
        title: $$(el).attr('title'),
        isFiller: $$(el).hasClass('ssl-item-filler'),
        img:episodedata.has(parseInt($$(el).attr('data-number')))?episodedata.get(parseInt($$(el).attr('data-number'))):info.image.medium
      });
    });
    return info;
  } catch (err) {
    console.warn("Failed to fetch info", err);
  }
}


getAnimeInfo('isekai-onsen-paradise-uncensored-18982');