const db = require("../../../config/dbConfig");



let checkUserExist = async (email) => {
    let op = await db.query('SELECT * FROM "user_profiles" WHERE email = $1;', [
        email
      ]);

    return op;
}

module.exports.checkUserExist = checkUserExist;
module.exports.checkUserMobileExist = async (ph_no) => {
    let op = await db.query('SELECT * FROM "user_profiles" WHERE ph_no = $1;', [
        ph_no
      ]);

    return op;
}

let createUser = async (data) => {

    let op = await db.query('INSERT INTO "user_profiles" (email, first_name, last_name, ph_no, education, created_at, is_peer, country, time_zone, is_admin, is_expert, is_active, last_login, is_reported, signup_type, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
    [data.email, data.first_name, data.last_name, data.ph_no, data.education, data.created_at, data.is_peer, data.country, data.time_zone, data.is_admin, data.is_expert, data.is_active, data.last_login, data.is_reported, data.signup_type, data.password])

    return op;
}

module.exports.createUser = createUser;


let createExpertProfile = async (data) =>{
    let rating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    console.log(rating);
let op = await db.query('insert into expert (user_id, current_org, expert_in_field, charges, ratings, expert_info, preferred_slot_1, preferred_slot_2, preferred_slot_3) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) on conflict (user_id) do update set current_org=$2, expert_in_field=$3 , charges=$4, ratings=$5, expert_info=$6, preferred_slot_1=$7, preferred_slot_2=$8, preferred_slot_3=$9 returning *',[
    data.user_id, data.current_org, data.expert_in_field, data.charges, rating, data.expert_info, data.preferred_slot_1, data.preferred_slot_2, data.preferred_slot_3
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