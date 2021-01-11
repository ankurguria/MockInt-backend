const db = require('../../../config/dbConfig')

module.exports.createSlotRequest = async (data) => {
    let op = await db.query('insert into interview_requests ("user_id","preferred_slot", "created_at", "updated_at", "is_expert_interview", "expert_id", "type_of_interview") values ($1, $2, $3, $4, $5, $6, $7) returning *',
    [
        data.user_id,
        data.preferred_slot, 
        data.created_at,
        data.updated_at,
        data.is_expert_interview,
        data.expert_id,
        data.type_of_interview,
    ]);
    return op;
}

module.exports.searchPeer = async (data) => {
    let op = await db.query('select * from interview_requests where preferred_slot = $1 AND type_of_interview = $2',
    [
        data.preferred_slot,
        data.type_of_interview
        
    ]);
    return op;
}

module.exports.deleteFromRequest = async(schedule_id) => {
    let op = await db.query('delete from interview_requests where schedule_id = $1 returning *;',[schedule_id]);

    return op;
}

module.exports.createSchedule = async (data) => {
    let op = await db.query('insert into scheduled_interviews ("interviewer_id", "interviewee_id", "type_of_interview", "slot_timestamp", "created_by", "updated_by", "created_at", "updated_at", "is_finished", "is_expert_interview") values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *;',
    [
        data.interviewer_id, data.interviewee_id, data.type_of_interview, data.preferred_slot, data.created_by, data.updated_by, data.created_at, data.updated_at, data.is_finished, data.is_expert_interview
    ])
    return op;
}
module.exports.deleteSession = async (session_id) =>{
    let op = await db.query('delete from scheduled_interviews where session_id = $1 returning *;',[session_id])
    return op;
}