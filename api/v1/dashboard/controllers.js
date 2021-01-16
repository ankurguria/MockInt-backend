const query = require('./queries')

let userDashboardController = async (req, res) => {
    // console.log(req.user);
    const userId = req.user.id;
    // let data = {

    // }
    try{
        let user = await query.getUserProfile(userId);
        
        if(user.rows[0].is_expert){

            let requestedInter = await query.getExperRequestedtInterviewsInfo(userId);
            let upcomingInter = await query.getUpcomingCompletedInterviewsInfo({"is_finished" : false, "user_id": userId});
            let finishedInter = await query.getUpcomingCompletedInterviewsInfo({"is_finished" : true, "user_id": userId});
            // let expertProfile = await query.getUserProfile()
            console.log(userId);

            data = {
                "max_score": "__",
                "avg score":"__",
                "first_name":user.rows[0].first_name,
                "last_name": user.rows[0].last_name,
                "total_interviews":"__",
                "requested_interviews": requestedInter.rows,
                "upcoming_interviews": upcomingInter.rows,
                "completed_interviews": finishedInter.rows,
                }
        }else{

            let upcomingInter = await query.getUpcomingCompletedInterviewsInfo({"is_finished" : false, "user_id": userId});
            let finishedInter = await query.getUpcomingCompletedInterviewsInfo({"is_finished" : true, "user_id": userId});

            console.log(upcomingInter.rows);
            data= {
                "max_score":"__",
                "avg score":"__",
                "first_name":user.rows[0].first_name,
                "last_name": user.rows[0].last_name,
                "total_interviews":"__",
                "upcoming_interviews": upcomingInter.rows,
                "completed_interviews": finishedInter.rows,
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