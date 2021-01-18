const db = require('../../../config/dbConfig')

module.exports.giveFeedback = async (data) => {
    let op = await db.query('insert into feedback ("session_id", "created_by", "updated_by", "created_at", "updated_at", "suggestions_for_us", "feedback", "overall_score", "report") values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;',
    [
        data.session_id,
        data.created_by, 
        data.updated_by,
        data.created_at,
        data.updated_at,
        data.suggestions_for_us,
        data.feedback,
        data.overall_score,
        data.report,
    ]);
    return op;
}

module.exports.viewFeedback = async (data) => {
    let op = await db.query('select * from feedback where session_id = $1 AND created_by != $2;', [data.session_id, data.created_by]);
    return op;
}

module.exports.markFinished = async (data) => {
    let op = await db.query("update scheduled_interviews set is_finished='true' where session_id=$1 returning *;",
    [
        data.session_id
    ])
}
