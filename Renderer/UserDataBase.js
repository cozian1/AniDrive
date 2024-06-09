import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

//let db = SQLite.openDatabase("Anidrive.db");
let db ;
SQLite.openDatabaseAsync("Anidrive.db").then((database)=> db=database);

export class DataBase {
  static Userdb;
  static dummy = null;

  static async openDb(){
    db = await SQLite.openDatabaseAsync("Anidrive.db");
    console.log('cat',db);
  }

  static async setUpDatabase() {
    await this.openDb();
    db.execAsync(
     `create table if not exists FevList (id integer primary key not null, anime_id varchar(255), name varchar(255), src text, type varchar(50), created_at TIMESTAMP);
      create table if not exists UserSettings (id integer primary key not null,playbackQuality varchar(20),playbackAudio varchar(20),playbackSubtitle varchar(100),downloadQuality varchar(20),downloadAudio varchar(20),downloadSubtitle varchar(100));
      create table if not exists WatchHistory (id integer primary key not null,animeId varchar(255), episodeNumber integer, playbackTime integer,name varchar(255), src text, type varchar(50), last_updated TIMESTAMP);`
    );
  }
  static dropDB() {
    console.log("cat");
    db.execAsync("DROP TABLE FevList",[],(_, result) => console.log(result),(_, error) => console.log(error));
    db.execAsync("DROP TABLE WatchHistory",[],(_, result) => console.log(result),(_, error) => console.log(error));
    db.execAsync("DROP TABLE UserSettings",[],(_, result) => console.log(result),(_, error) => console.log(error));
  }
  static FEVLIST = {
    updateFev: async (exists, { id, name, src, type }) => {
      exists?
        db.runAsync("insert into FevList values (?,?,?,?,?,CURRENT_TIMESTAMP)",[parseInt((""+id).split("-").pop()), id, name, src, type]).then(()=>{}).catch((err) => console.log(err)):
        db.runAsync("delete from FevList where id=?",[parseInt((""+id).split("-").pop())]);
      return true;
    },
    getFevList: async () => {
      const records=await db.getAllAsync("select * from FevList order by created_at desc");
      return records;
    },
    contains: async (id) => {
      const record =await db.getFirstAsync("select id from FevList where id=?",[parseInt(("" + id).split("-").pop())]);
      return record!=null;
    },
    cleanTable: async() => {
      return await db.execAsync("delete from FevList");
    },
  };
  static WATCHHISTORY = {
    addRecord: async ({id ,AniId ,number },{ name, src, type },playback=0) => {
      return await db.runAsync("INSERT INTO WatchHistory (id, animeId, episodeNumber, playbackTime, name, src, type, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);",[AniId,id,number,playback,name,src,type]);

    },
    updatePlay: async ({AniId ,number },playback=0) => {
      return await db.runAsync(" UPDATE WatchHistory SET episodeNumber=?, playbackTime=?, last_updated= CURRENT_TIMESTAMP WHERE id=?;",[number,playback,AniId]);

    },
    getPlaybackData: async (id) => {
      return await db.getFirstAsync("select * from WatchHistory where id=?",[id]);

    },
    getWatchHistory: async () => {
      return await db.getAllAsync("select * from WatchHistory ORDER BY last_updated DESC");

    },
    cleanTable: async () => {
      return await db.execAsync("delete from WatchHistory");
    },
    removeItem: async (id) => {
      return await db.runAsync("DELETE from WatchHistory where animeId=?",[id]);

    },
  };
  static Settings={
    updateSettings: async (playbackQuality ,playbackAudio ,playbackSubtitle ,downloadQuality,downloadAudio,downloadSubtitle) => {
      return await db.runAsync("INSERT OR REPLACE INTO UserSettings (id,playbackQuality,playbackAudio,playbackSubtitle,downloadQuality,downloadAudio,downloadSubtitle) VALUES (0, ?, ?, ?, ?, ?, ?);",[playbackQuality ,playbackAudio ,playbackSubtitle ,downloadQuality,downloadAudio,downloadSubtitle]);

    },
    getSettings: async () => {
      return await db.getAllAsync("select * from UserSettings");

    },
  }
}
