const query = require('./queries')
const moment = require('moment')

slotBookingController = async (req, res) => {
    let data = req.body;
    data.interviewee_id = req.user.id;
    data.created_at = moment().format();
    data.updated_at = data.created_at;
    data.created_by = req.user.id;
    data.updated_by = req.user.id;
    data.is_finished = false;
    data.called_due_to_cancel = false;
    
    try{
        if(data.is_expert_interview){
            let slotReqData = {
                "user_id": req.user.id,
                "preferred_slot": data.preferred_slot,
                "created_at": data.created_at,
                "updated_at": data.updated_at,
                "is_expert_interview": data.is_expert_interview,
                "expert_id": data.interviewer_id,
                "type_of_interview": data.type_of_interview,
                "interviewee_id": data.interviewee_id
            }
            let slotReq = await query.createSlotRequest(slotReqData);
            console.log(slotReq.rows[0]);
            return res.status(200).send("True");
        }else{
            let searchPeersData = {
                "preferred_slot":data.preferred_slot,
                "type_of_interview" : data.type_of_interview
            }
            let peersInfo = await query.searchPeer(searchPeersData);
            console.log(peersInfo.rows[0]);
            // return res.status(200).json(peersInfo);
            if(peersInfo.rowCount===0){
                let slotReqData = {
                    "user_id": req.user.id,
                    "preferred_slot": data.preferred_slot,
                    "created_at": data.created_at,
                    "updated_at": data.updated_at,
                    "is_expert_interview": false,
                    "expert_id": null
                }
                let slotReq = await query.createSlotRequest(slotReqData);
                console.log(slotReq.rows[0]);
                if(data.called_due_to_cancel){
                    return true;
                }else{
                    return res.status(200).json({"status":false, "message":"slot requested waiting for a peer with similar skills and time preferences to match we'll get in touch with you soon once a match is found"});
                }
                
            }else{
                data.interviewer_id = peersInfo.rows[0].user_id;
                // data.slot_timestamp = ;
                let scheduleInterview = await query.createSchedule(data);
                console.log(scheduleInterview.rows[0]);
                let deletedRequest = await query.deleteFromRequest(peersInfo.rows[0].schedule_id);
                console.log(deletedRequest.rows[0]);
                if(data.called_due_to_cancel){
                    return true;
                }else{
                    return res.status(200).send("True");
                }
                // if(scheduleInterview.rowCount>0){
                    // let deletedRequest = await query.deleteFromRequest(data.schedule_id);
                    // console.log(deletedRequest.rows[0]);
                    // return res.status(200).send("Interview scheduled successfully");
                // }else{
                //     let deleteInterviewSession = await query.deleteSession(scheduleInterview.rows[0].session_id);
                //     console.log(deleteInterviewSession.rows[0]);
                //     return res.status(500).send("server error");
                // }
            }
        }
        
    }catch(err){
        console.log(err.message);
        return res.status(500).send("Something went wrong")
    }
}

// module.exports.searchForPeers = async (req,res) => {
//     let data = req.body;
//     try{
        // let peersInfo = await query.searchPeer(data);
        // console.log(peersInfo.rows[0]);
        // return res.status(200).json(peersInfo);
//     }catch(err){
//         console.log(err.message);
//     }
// }
module.exports.slotBookingController = slotBookingController;

module.exports.cancelSession = async (req, res) => {
    let data = req.body.session_id;
    try{
        if(data.is_expert_interview){
            let deletedData = await query.deleteSession(data);
            console.log(deletedData.rows[0]);
            return res.status(200).send("interview canceled successfully");
        }else{
            let sessionInfo = query.getSessionInfo(data);
            let user = ((req.user.id===sessionInfo.interviewer_id) ? interviewee_id:interviewer_id);
            let cancledUserData = {
                "body":{
                    "user":{
                        "id":user,
                    },
                    "is_expert_interview":"false",
                    "preferred_slot": sessionInfo.slot_timestamp,
                    "type_of_interview": sessionInfo.type_of_interview,
                    "called_due_to_cancel": true
                }
            }
            let res={};
            slotBookingController(cancledUserData, res);
            let deletedData = await query.deleteSession(data);
            console.log(deletedData.rows[0]);
            return res.status(200).send("interview canceled successfully");
        }
        
    }catch(err){
        console.log(err.message);
    }
}

/*for cancel session json required
{
    "session_id":"",
}
*/



module.exports.expertAcceptRequest = async (req,res) => {
    try{
        let requestInfo = await query.getInterviewRequestInfo(req.body.schedule_id);
        let data = {
            "interviewer_id": req.user.id,
            "interviewee_id" : requestInfo.rows[0].user_id,
            "preferred_slot" : requestInfo.rows[0].preferred_slot,
            "created_by" : requestInfo.rows[0].user_id,
            "updated_by" : req.user.id, 
            "created_at" : requestInfo.rows[0].created_at,
            "updated_at" : moment().format(),
            "is_finished" : false,
            "is_expert_interview" : true
        }

        let scheduleInterview = await query.createSchedule(data);
        console.log(scheduleInterview.rows[0]);
        let deletedRequest = await query.deleteFromRequest(req.body.schedule_id);
        console.log(deletedRequest.rows[0]);
        return res.status(200).send("True");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }

}
/* for accept and reject both this is the data format also pass the token
{
    "schedule_id":""
}
 */

module.exports.expertRejectRequest = async (req,res) => {

    try{
        let deletedRequest = await query.deleteFromRequest(req.body.schedule_id);
        console.log(deletedRequest.rows[0]);
        return res.status(200).send("True");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }
    
}