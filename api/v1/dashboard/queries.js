const db = require("../../../config/dbConfig");


let getUserProfile = async (userId) =>{
    let op = await db.query('select * from user_profiles where user_id = $1', [userId]);
    return op;
}   
module.exports.getUserProfile = getUserProfile;

module.exports.getExperRequestedtInterviewsInfo = async (user_id) => {
    let op = await db.query('select * from interview_requests where is_expert_interview = true AND expert_id = $1;', [user_id])

    return op;
}

module.exports.getUpcomingCompletedInterviewsInfo = async (data) => {
    let op = await db.query('select * from scheduled_interviews where is_finished = $1 AND (interviewee_id = $2 or interviewer_id = $2);',
    [
        data.is_finished,
        data.user_id,
    ])
    return op;
}




