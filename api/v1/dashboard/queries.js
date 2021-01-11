const db = require("../../../config/dbConfig");


let getUserProfile = async (userId) =>{
    let op = await db.query('select * from user_profiles where user_id = $1', [userId]);
    return op;
}   
module.exports.getUserProfile = getUserProfile;