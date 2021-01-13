const db = require("../../../config/dbConfig");


let getUserProfile = async (userId) =>{
    let op = await db.query('select * from user_profiles where user_id = $1', [userId]);
    return op;
}   
module.exports.getUserProfile = getUserProfile;

module.exports.getExpertInterviewsInfo = async (data) => {
    let op = await db.query('select * from scheduled_interviews where is_finished = $1 AND interviewer_id = $2;',
    [
        data.is_finished,
        data.interviewer_id,
    ])

    return op;
}

module.exports.getPeerInterviewsInfo = async (data) => {
    let op = await db.query('select * from scheduled_interviews where is_finished = $1 AND (interviewee_id = $2 or interviewer_id = $2;',
    [
        data.is_finished,
        data.user_id,
    ])
    return op;
}



