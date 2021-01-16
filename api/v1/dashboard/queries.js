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
    let op = await db.query('select first_name, last_name, session_id, interviewer_id, interviewee_id, type_of_interview, slot_timestamp, is_finished, is_expert_interview  from scheduled_interviews inner join user_profiles on user_profiles.user_id=scheduled_interviews.interviewer_id where is_finished = $1 AND (interviewee_id = $2 or interviewer_id = $2);',
    [
        data.is_finished,
        data.user_id,
    ])
    return op;
}




