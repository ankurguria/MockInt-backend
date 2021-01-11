const db = require("../../../config/dbConfig");



let checkUserExist = async (email) => {
    let op = await db.query('SELECT * FROM "user_profiles" WHERE email = $1', [
        email
      ]);

    return op;
}

module.exports.checkUserExist = checkUserExist;

let createUser = async (data) => {

    let op = await db.query('INSERT INTO "user_profiles" (email, first_name, last_name, ph_no, education, created_at, is_peer, country, time_zone, is_admin, is_expert, is_active, last_login, is_reported, signup_type, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
    [data.email, data.first_name, data.last_name, data.ph_no, data.education, data.created_at, data.is_peer, data.country, data.time_zone, data.is_admin, data.is_expert, data.is_active, data.last_login, data.is_reported, data.signup_type, data.password])

    return op;
}

module.exports.createUser = createUser;


let createExpertProfile = async (data) =>{
let op = await db.query('insert into expert (user_id, current_org, expert_in_field, charges, ratings, expert_info) values ($1, $2, $3, $4, $5, $6) returning *',[
    data.user_id, data.current_org, data.expert_in_field, data.charges, 3, data.expert_info
])
return op;
}

let createPeerProfile = async (data) =>{
    let op = await db.query('insert into peer (user_id, role_preparing_for) values ($1,$2) returning *',[
        data.user_id, data.role_preparing_for
    ])
    return op;
    }
module.exports.createPeerProfile = createPeerProfile;
module.exports.createExpertProfile = createExpertProfile;