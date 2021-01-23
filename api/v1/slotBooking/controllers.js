const query = require('./queries')
const moment = require('moment')
const {transporter, mailOptions} = require('../sendemail/sendemail');


slotBookingController = async (req, res) => {
    let data = req.body;
    data.interviewee_id = req.user.id;
    data.created_at = moment().format();
    data.updated_at = data.created_at;
    data.created_by = req.user.id;
    data.updated_by = req.user.id;
    data.is_finished = false;
    // console.log(data);
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
            // console.log(slotReq.rows[0]);

            let emailPeer = await query.getEmail(req.user.id);
            let emailExpert = await query.getEmail(data.interviewer_id);

            mailOptions.to = emailExpert.rows[0].email + ',' + emailPeer.rows[0].email;
            mailOptions.subject = "Expert Interview Requested";
            mailOptions.text = "Both the expert and peer are being notified regarding the expert interview request";

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });

            return res.status(200).json({"status":"true"});
        }else{
            let searchPeersData = {
                "preferred_slot":data.preferred_slot,
                "type_of_interview" : data.type_of_interview,
                "user_id": req.user.id
            }
            let peersInfo = await query.searchPeer(searchPeersData);
            console.log(peersInfo.rows[0]);
            // return res.status(200).json(peersInfo);
            if(peersInfo.rows.length===0){
                let slotReqData = {
                    "user_id": req.user.id,
                    "preferred_slot": data.preferred_slot,
                    "created_at": data.created_at,
                    "updated_at": data.updated_at,
                    "is_expert_interview": false,
                    "expert_id": null,
                    "type_of_interview":data.type_of_interview
                }
                let slotReq = await query.createSlotRequest(slotReqData);
                console.log(slotReq.rows[0]);

                let emailPeer = await query.getEmail(req.user.id);

                mailOptions.to = emailPeer.rows[0].email;
                mailOptions.subject = "Waitlisted for Peer Interview";
                mailOptions.text = "You have been put on a queue for a peer interview on MIP";

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                });

                return res.status(200).json({"status":false});
                
            }else{
                data.interviewer_id = peersInfo.rows[0].user_id;
                data.is_expert_interview = peersInfo.rows[0].is_expert_interview;
                // data.slot_timestamp = ;
                let scheduleInterview = await query.createSchedule(data);
                console.log(scheduleInterview.rows[0]);
                let deletedRequest = await query.deleteFromRequest(peersInfo.rows[0].schedule_id);
                console.log(deletedRequest.rows[0]);

                // let emailPeer = await query.getEmail(req.user.id);
                // let emailExpert = await query.getEmail(data.interviewer_id);

                // mailOptions.to = emailExpert.rows[0].email + ',' + emailPeer.rows[0].email;
                // mailOptions.subject = "Confirmed Peer Interview";
                // mailOptions.text = "You have been matched with a peer for an interview at MIP";

                // transporter.sendMail(mailOptions, function(error, info){
                //     if (error) {
                //     console.log(error);
                //     } else {
                //     console.log('Email sent: ' + info.response);
                //     }
                // });

                return res.status(200).json({"status":"true"});
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
        if(req.body.is_expert_interview){
            let deletedData = await query.deleteSession(data);
            // console.log(deletedData.rows[0]);

            let emailPeer = await query.getEmail(deletedData.rows[0].interviewee_id);
            let emailExpert = await query.getEmail(deletedData.rows[0].interviewer_id);

            mailOptions.to = emailExpert.rows[0].email + ',' + emailPeer.rows[0].email;
            mailOptions.subject = "Cancelled Expert Interview";
            mailOptions.text = "Both the expert and peer are being notified regarding the interview cancellation";

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });

            return res.status(200).send("interview canceled successfully");
        }else{
            let sessionInfo = await query.getSessionInfo(data);
            console.log(data);
            console.log(sessionInfo.rows[0]);
            let user = ((req.user.id===sessionInfo.rows[0].interviewer_id) ? sessionInfo.rows[0].interviewee_id : sessionInfo.rows[0].interviewer_id);
            let canceledUserData = {
                "body":{
                    "user":{
                        "id":user,
                    },
                    "is_expert_interview":false,
                    "preferred_slot": sessionInfo.slot_timestamp,
                    "type_of_interview": sessionInfo.type_of_interview,
                    "called_due_to_cancel": true
                }
            }
            // let res={};
            // slotBookingController(cancledUserData, res);
            let deletedData = await query.deleteSession(data);
            // console.log(canceledUserData);

            let emailPeer = await query.getEmail(sessionInfo.rows[0].interviewer_id);
            let emailExpert = await query.getEmail(sessionInfo.rows[0].interviewer_id);

            mailOptions.to = emailExpert.rows[0].email + ',' + emailPeer.rows[0].email;
            mailOptions.subject = "Cancelled Expert Interview";
            mailOptions.text = "Both the peers are being notified regarding the peer interview cancellation";

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });

            res.status(200).send(canceledUserData);
        }
        
    }catch(err){
        console.log(err.message);
    }
}


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
            "is_expert_interview" : true,
            "type_of_interview": requestInfo.rows[0].type_of_interview
        }

        let scheduleInterview = await query.createSchedule(data);
        // console.log(scheduleInterview.rows[0]);
        let deletedRequest = await query.deleteFromRequest(req.body.schedule_id);
        // console.log(deletedRequest.rows[0]);

        let emailPeer = await query.getEmail(data.interviewee_id);
        let emailExpert = await query.getEmail(data.interviewer_id);

        mailOptions.to = emailExpert.rows[0].email + ',' + emailPeer.rows[0].email;
        mailOptions.subject = "Expert Interview Confirmation";
        mailOptions.text = "Both the expert and peer are being notified regarding the expert interview confirmation";

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).send("True");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }

}

module.exports.expertRejectRequest = async (req,res) => {

    try{
        let deletedRequest = await query.deleteFromRequest(req.body.schedule_id);
        // console.log(deletedRequest.rows[0]);

        let emailPeer = await query.getEmail(deletedRequest.rows[0].user_id);
        let emailExpert = await query.getEmail(deletedRequest.rows[0].expert_id);
        // console.log(emailExpert);

        mailOptions.to = emailExpert.rows[0].email + ',' + emailPeer.rows[0].email;
        mailOptions.subject = "Expert Interview Rejection";
        mailOptions.text = "Both the expert and peer are being notified regarding the expert interview rejection";

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).send("True");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }
    
}

module.exports.getExpertDataController = async (req,res) => {

    try{
        let allExpertData = await query.getExpertData(req.user.id);

        // console.log(allExpertData);
        return res.status(200).send(allExpertData.rows);
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }
    
}