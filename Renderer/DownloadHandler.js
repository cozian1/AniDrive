import * as IntentLauncher from "expo-intent-launcher";
import { getStreams } from "./ZoroHome";
import { DataBase } from "./UserDataBase";
import { pullserver } from "./SourceParser";

export class Downloader {
  static isRunning = false;
  static downloadQueue = [];
  static async StartDownloader() {
    if (!this.isRunning && this.downloadQueue.length != 0) {
      console.log('started to download');
      this.isRunning = true;
      while (this.downloadQueue != 0) {
        let {CurrentEpisode,title,vidurl,suburl}=this.downloadQueue.at(-1);
        if (!vidurl) {
          const Settings=await DataBase.Settings.getSettings().then((res)=>res.pop());
          //const d = await getStreams(CurrentEpisode);
          //vidurl = d.sub[2].url;
          console.log(Settings)
          const d=await pullserver(CurrentEpisode.episode_id,Settings.downloadAudio);
          for(i of d?.sources){
            if(i.quality==Settings.downloadQuality){
              vidurl=i.url;
              break;
            }
          }
          for (i of d?.subtitles) {
            if (i.lang == Settings.downloadSubtitle) {
              suburl = i.url;
              break;
            }
          }
        }
        await this.Download(title,CurrentEpisode.number,vidurl,suburl);
        this.downloadQueue.pop()
      }
      this.isRunning = false;
    }
  }
  static addItem(id,CurrentEpisode,title,vidurl = null,suburl = null){
    this.downloadQueue.unshift({id,CurrentEpisode,title,vidurl,suburl});
    console.log('got till add');
    this.StartDownloader();
  }
  static isProcessing(id){
    for(let i of this.downloadQueue){
      if(id==i.id){
        return true;
      }
    }
    return false;
  }
  static async Download(title,number,vidurl,suburl){
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      packageName: "idm.internet.download.manager.plus",
      className: "idm.internet.download.manager.Downloader",
      data: vidurl,
      type: "video/*",
      extra: {
        extra_filename: title + " Episode: " + number + ".mp4",
      },
    }).catch((err) => console.log(err));
    if (suburl) {
      await IntentLauncher.startActivityAsync(
        "android.intent.action.VIEW",
        {
          packageName: "idm.internet.download.manager.plus",
          className: "idm.internet.download.manager.Downloader",
          data: suburl,
          extra: {
            extra_filename: title + " Episode: " + number,
          },
        }
      ).catch((err) => console.log(err));
    }
  }
}
