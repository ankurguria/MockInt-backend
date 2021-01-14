const query = require('./queries')
const moment = require('moment')

module.exports.giveFeedback = async (req,res) => {

    let data = req.body;
    data.created_at = moment().format();
    data.updated_at = data.created_at;
    data.created_by = req.user.id;
    data.updated_by = req.user.id;
    try{
        let feedbackGiven = await query.giveFeedback(data);
        // console.log(deletedRequest.rows[0]);
        return res.status(200).send("Feedback given");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }
    
}

module.exports.viewFeedback = async (req,res) => {

    try{
        let feedback = await query.viewFeedback(req.body.session_id);
        // console.log(allExpertData);
        return res.status(200).send(feedback.rows[0]);
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }
    
}