import {castVote, getCaseResults} from "../services/fileServ.js";

export async function CastVote(req, res){
    try{
        const caseId = req.params.caseId;
        const party = req.params.party;
        const { data, error } = await castVote(caseId, party);
    
        if (error) return { error: error.message, msg: "Cast vote failed" };
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl CastVote" });
    }
}

export async function GetResults(req, res){
    try{
        const caseId = req.params.caseId;
        const result = await getCaseResults(caseId);
        res.status(200).json({ message: 'Case results fetched successfully', results: result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl GetResults" });
    }
}