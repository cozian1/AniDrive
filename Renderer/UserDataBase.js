import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

let db = SQLite.openDatabase("Anidrive.db");

export class DataBase {
  static Userdb;
  static dummy = null;

  static setUpDatabase() {
    this.Userdb = db;
    db.transaction((tx) => {
      tx.executeSql("create table if not exists FevList (id integer primary key not null, anime_id varchar(255), name varchar(255), src text, type varchar(50), created_at TIMESTAMP);");
      tx.executeSql("create table if not exists UserSettings (id integer primary key not null,playbackQuality varchar(20),playbackAudio varchar(20),playbackSubtitle varchar(100),downloadQuality varchar(20),downloadAudio varchar(20),downloadSubtitle varchar(100));");
      tx.executeSql("create table if not exists WatchHistory (id integer primary key not null,animeId varchar(255), episodeNumber integer, playbackTime integer,name varchar(255), src text, type varchar(50), last_updated TIMESTAMP)");
    });
  }
  static dropDB() {
    console.log("cat");
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE FevList",[],(_, result) => console.log(result),(_, error) => console.log(error));
      tx.executeSql("DROP TABLE WatchHistory",[],(_, result) => console.log(result),(_, error) => console.log(error));
      tx.executeSql("DROP TABLE UserSettings",[],(_, result) => console.log(result),(_, error) => console.log(error));
      //tx.executeSql("create table if not exists UserSettings (id integer primary key not null, done int, value text);");
      //tx.executeSql("create table if not exists WatchHistory (id integer primary key not null, done int, value text);");
    });
  }
  static FEVLIST = {
    updateFev: (exists, { id, name, src, type }) => {
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                if (exists) {
                  tx.executeSql("insert into FevList values (?,?,?,?,?,CURRENT_TIMESTAMP)",[parseInt((""+id).split("-").pop()), id, name, src, type],(_, result) => resolve(result),(_, error) => reject(error));
                } else {
                  tx.executeSql("delete from FevList where id=?",[parseInt((""+id).split("-").pop())],(_, result) => resolve(result),(_, error) => reject(error));
                }
              })
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    getFevList: () => {
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("select * from FevList order by created_at desc",[],(_, { rows }) => resolve(rows._array),(_, error) => reject(error));
              })
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    contains: (id) => {
      return new Promise((resolve, reject) => {
        try {
          id = parseInt(("" + id).split("-").pop());
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("select id from FevList where id=?",[id],(_, result) => {resolve(result.rows.length == 1);},(_, error) => {reject(error);});
              })
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    cleanTable: () => {
      db.transaction((tx) => {
        tx.executeSql("delete from FevList", []);
      });
    },
  };
  static WATCHHISTORY = {
    addRecord: ({id ,AniId ,number },{ name, src, type },playback=0) => {
      return new Promise((resolve, reject) => {
        id=((''+id).split('/').pop());
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("INSERT INTO WatchHistory (id, animeId, episodeNumber, playbackTime, name, src, type, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);",[AniId,id,number,playback,name,src,type],(_, result) => resolve(result),(_, error) => reject(console.log(error)));
              }).catch((err)=>null)
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    updatePlay: ({AniId ,number },playback=0) => {
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql(" UPDATE WatchHistory SET episodeNumber=?, playbackTime=?, last_updated= CURRENT_TIMESTAMP WHERE id=?;",[number,playback,AniId],(_, result) => resolve(result),(_, error) => reject(console.log(error)));
              })
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    getPlaybackData: (id) => {
      console.log('cat',id);
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("select * from WatchHistory where id=?",[id],(_, { rows }) => resolve(rows._array),(_, error) => reject(console.log("getPlaybackData",error)));
              }).catch((err)=>console.log(err))
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    getWatchHistory: () => {
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("select * from WatchHistory ORDER BY last_updated DESC",[],(_, { rows }) => resolve(rows._array),(_, error) => reject(error));
              })
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    cleanTable: () => {
      db.transaction((tx) => {
        tx.executeSql("delete from WatchHistory", []);
      });
    },
    removeItem: (id) => {
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("DELETE from WatchHistory where animeId=?",[id],(_, { rows }) => resolve(rows._array),(_, error) => reject(console.log(error)));
              }).catch((err)=>console.log(err))
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
  };
  static Settings={
    updateSettings: (playbackQuality ,playbackAudio ,playbackSubtitle ,downloadQuality,downloadAudio,downloadSubtitle) => {
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("INSERT OR REPLACE INTO UserSettings (id,playbackQuality,playbackAudio,playbackSubtitle,downloadQuality,downloadAudio,downloadSubtitle) VALUES (0, ?, ?, ?, ?, ?, ?);",[playbackQuality ,playbackAudio ,playbackSubtitle ,downloadQuality,downloadAudio,downloadSubtitle],(_, result) => resolve(result),(_, error) => reject(console.log(error)));
              })
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    getSettings: () => {
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async (tx) => {
            resolve(
              await new Promise((resolve, reject) => {
                tx.executeSql("select * from UserSettings",[],(_, { rows }) => resolve(rows._array),(_, error) => reject(error));
              })
            );
          });
        } catch (err) {
          reject(err);
        }
      });
    },
  }
}
