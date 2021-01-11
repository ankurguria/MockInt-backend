const query = require('./queries')
const moment = require('moment')

module.exports.slotBookingController = async (req, res) => {
    let data = req.body;
    data.interviewee_id = req.user.id;
    data.created_at = moment().format();
    data.updated_at = data.created_at;
    data.created_by = req.user.id;
    data.updated_by = req.user.id;
    data.is_finished = false;
    
    try{
        if(data.is_expert_interview){
            let slotReqData = {
                "user_id": req.user.id,
                "preferred_slot": data.preferred_slot,
                "created_at": data.created_at,
                "updated_at": data.updated_at,
                "is_expert_interview": data.is_expert_interview,
                "expert_id": data.interviewer_id
            }
            let slotReq = await query.createSlotRequest(slotReqData);
            console.log(slotReq.rows[0]);
            return res.status(200).send("slot requested successfully to an expert");
        }else{
            if(data.interviewer_id === "" || data.interviewee_id === ""){
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
                return res.status(200).send("slot requested waiting for a peer with similar skills and time preferences to match we'll get in touch with you soon once a match is found");
            }else{
                let scheduleInterview = await query.createSchedule(data);
                if(scheduleInterview.rowCount()>0){
                    let deletedRequest = await query.deleteFromRequest(data.schedule_id);
                    console.log(deletedRequest.rows[0]);
                    return res.status(200).send("Interview scheduled successfully");
                }else{
                    let deleteInterviewSession = await query.deleteSession(scheduleInterview.rows[0].session_id);
                    console.log(deleteInterviewSession.rows[0]);
                    return res.status(500).send("server error");
                }
            }
        }
        
    }catch(err){
        console.log(err.message);
    }
}

module.exports.searchForPeers = async (req,res) => {
    let data = req.body;
    try{
        let peersInfo = await query.searchPeer(data);
        console.log(peersInfo.rows[0]);
        return res.status(200).json({"availaible_peers": peersInfo.rows[0]});
    }catch(err){
        console.log(err.message);
    }

}
module.exports.cancelSession = async (req, res) => {
    let data = req.body.session_id;
    try{
        let deletedData = await query.deleteSession(data);
        console.log(deletedData.rows[0]);
        return res.status(200).send("interview canceled successfully");
    }catch(err){
        console.log(err.message);
    }
}