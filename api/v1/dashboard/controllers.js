const query = require('./queries')

let userDashboardController = async (req, res) => {
    // console.log(req.user);
    const userId = req.user.id;
    let data = {

    }
    try{
        let user = await query.getUserProfile(userId);
        if(user.rows[0].is_expert){
            data = {
                "max_score": "__",
                "avg score":"__",
                "first_name":user.rows[0].first_name,
                "last_name": user.rows[0].last_name,
                "total_interviews":"__",
                "requested_interviews": [
                        {   "request_from":"__",
                            "Interview_type": "__",
                            "slot_timestamp":"__",
                        },
                    ],
                "upcoming_interviews":[
                            {   "scheduled_with":"__",
                                "Interview_type": "__",
                                "gmeets_link": "__",
                                "gcalander_link":"__",
                                "slot_timestamp":"__",
                            },
                        ],
                    
                "completed_interviews":[
                        {   "scheduled_with":"__",
                            "Interview_type": "__",
                            "feedback_link": "__",
                            "gcalander_link":"__",
                            "slot_timestamp":"__",
                        },
                    ],
                }
        }else{
            data= {
                "max_score":"__",
                "avg score":"__",
                "first_name":user.rows[0].first_name,
                "last_name": user.rows[0].last_name,
                "total_interviews":"__",
                "upcoming_interviews":[
                            {   "scheduled_with":"__",
                                "Interview_type": "__",
                                "gmeets_link": "__",
                                "gcalander_link":"__",
                                "slot_timestamp":"__",
                            },
                        ],
                    
                "completed_interviews":[
                        {   "scheduled_with":"__",
                            "Interview_type": "__",
                            "feedback_link": "__",
                            "gcalander_link":"__",
                            "slot_timestamp":"__",
                        },
                    ],
            }
        }
        // console.log(user.rows);
        return res.status(200).json(data);
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }

 
}

module.exports.userDashboardController = userDashboardController