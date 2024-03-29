const query = require('./queries')
const moment = require('moment')

module.exports.giveFeedback = async (req,res) => {

    let data = req.body;
    data.created_at = moment().format();
    data.updated_at = data.created_at;
    data.created_by = req.user.id;
    data.updated_by = req.user.id;
    try{
        let finished_session = await query.markFinished(data);
        let feedbackGiven = await query.giveFeedback(data);
        // console.log(deletedRequest.rows[0]);
        return res.status(200).send("Feedback given");
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }
    
}

module.exports.viewFeedback = async (req,res) => {
    const data = req.body;
    data.created_by = req.user.id;
    try{
        let feedback = await query.viewFeedback(data);
        // console.log(allExpertData);
        if(feedback.rows.length>0)
            return res.status(200).send(feedback.rows[0]);
        else
            return res.status(200).json({"feedback": "not yet given you must wait for for 1 or 2 days for your peer to give feedback then write back to us if feedback is still not available "})
    }catch(err){
        console.log(err.message);
        return res.status(500).send("server error");
    }
    
}