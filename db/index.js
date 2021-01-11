const db = require('../config/dbConfig')


let connectDatabase = async () => {
    console.log("checking database connection");
    try{
      await db.connect();
      let query = await db.query('select * from domain;')
      console.log(query.rows);
      console.log("database connection working fine");
    }catch(error){
      console.log("database connection failed", error);
      process.exit(1);
    }
}

module.exports = connectDatabase;