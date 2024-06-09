import { getData, setData } from "../Renderer/AsyncStorage";

//import CryptoJS  from"crypto-js";
const CryptoJS = require("crypto-js");

export class KaidoRapidCloud {
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
    setData(this.keyStore,indexPairs);
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
      indexPairs = await getData(this.keyStore);
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
