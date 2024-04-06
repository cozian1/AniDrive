const CryptoJS = require("crypto-js");

export class MegaCloud {
  static name = "Megacloud";
  static mainUrl = "https://megacloud.tv";
  static embed = "/embed-2/ajax/e-1/getSources";
  static key = "https://zoro.anify.tv/key/6";
  static altKey = "https://raw.githubusercontent.com/theonlymo/keys/e1/key";
  static script = "https://megacloud.tv/js/player/a/prod/e1-player.min.js?v=";
  static sources = "https://megacloud.tv/embed-2/ajax/e-1/getSources?id=";

  static async Extract(id) {
    try {
      const data = await fetch(this.sources + id, {
        headers: {
          Accept: "*/*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Referer: 'https://hianime.to',
        },
      }).then((res) => res.json());

      let encryptedString = data.sources;
      const text = await fetch(this.script.concat(Date.now().toString())).then((res) => res.text());
      const vars = this.extractVariables(text, "MEGACLOUD");
      const { secret, encryptedSource } = this.getSecret(encryptedString, vars);
      const decrypted = await this.decrypt(encryptedSource, secret);
      
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
      console.log(vid);
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

  static extractVariables(text, sourceName) {
    let allvars;
    if (sourceName !== "MEGACLOUD") {
      allvars = text.match(/const (?:\w{1,2}=(?:'.{0,50}?'|\w{1,2}\(.{0,20}?\)).{0,20}?,){7}.+?;/gm)?.at(-1) ?? "";
    } else {
      allvars =text.match(/const \w{1,2}=new URLSearchParams.+?;(?=function)/gm)?.at(-1) ?? "";
    }
    const vars = allvars.slice(0, -1).split("=").slice(1).map((pair) => Number(pair.split(",").at(0))).filter((num) => num === 0 || num);
    return vars;
  }

  static getSecret(encryptedString, values) {
    let secret = "",
      encryptedSource = encryptedString,
      totalInc = 0;
    for (let i = 0; i < values[0]; i++) {
      let start, inc;
      switch (i) {
        case 0:
          (start = values[2]), (inc = values[1]);
          break;
        case 1:
          (start = values[4]), (inc = values[3]);
          break;
        case 2:
          (start = values[6]), (inc = values[5]);
          break;
        case 3:
          (start = values[8]), (inc = values[7]);
          break;
        case 4:
          (start = values[10]), (inc = values[9]);
          break;
        case 5:
          (start = values[12]), (inc = values[11]);
          break;
        case 6:
          (start = values[14]), (inc = values[13]);
          break;
        case 7:
          (start = values[16]), (inc = values[15]);
          break;
        case 8:
          (start = values[18]), (inc = values[17]);
      }
      const from = start + totalInc,
        to = from + inc;
      (secret += encryptedString.slice(from, to)),
        (encryptedSource = encryptedSource.replace(
          encryptedString.substring(from, to),
          ""
        )),
        (totalInc += inc);
    }

    return { secret, encryptedSource };
  }

  static decrypt(encrypted, keyOrSecret) {
    const decrypted=CryptoJS.AES.decrypt(encrypted, keyOrSecret).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted)[0];
  }
}
