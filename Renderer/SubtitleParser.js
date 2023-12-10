export async function parseSrt(url) {
  if(url=='') return [];
  //console.log(id,type);
  const subText = await fetch(url).then((r) => r.text());
  let temp = subText?.split("\n");
  temp.shift();
  const SubJson = [];
  let buffer={};
  for (line of temp) {
    if(line=='') continue;
    if(line.includes(" --> ")){

      if(buffer.start) SubJson.push(buffer);
      buffer={};
      let time = line?.split(" --> ");
      buffer.start=strToMili(time[0]);
      buffer.end=strToMili(time[1]);
    }else{
      if(buffer.start){
        buffer.part=buffer.part?buffer.part+'\n'+line:line;
        buffer.part=buffer.part.trim().replaceAll('<b>','').replaceAll('</b>','').replaceAll('<i>','').replaceAll('</i>','')

      }
    }
  }
  return SubJson;
}
function strToMili(str) {
  let time = str.split(":");
  let[h,m,s]=['0','0','0'];
  if(time.length==3){
    [h,m,s]=time;
  }else{
    [m,s]=time;
  }
  let mili=parseInt(s?.split('.')[1]);
  mili += parseInt(s?.split('.')[0]) * 1000;
  mili += parseInt(m) * 60 * 1000;
  mili += parseInt(h) * 60 * 60 * 1000;
  return mili;
}
// async function da() {
//   let d = await parseSrt(
//     'https://ccb.megaresources.co/ed/f2/edf2cdbeaf0fc1b114ac3956a0ddb0a6/ger-8.vtt'
//   );
//   console.log(d);
// }
// da();
