import { uploadFile, createCase, getAllCases, deleteCase, getCaseDetails, castVote } from "../services/fileServ.js";

export async function SubmitCase(req, res) {
    try {
        const file = req.file;
        const userId = req.body.caseId;
        console.log(req.role)
        const result = await uploadFile(userId, file, req.role);
        res.status(200).json({ message: 'File uploaded successfully', result });
    } catch (error) {
        res.status(500).json({ error1: error.message, msg: "fileCntrl" });
    }
}
export async function NewCase(req, res) {
    try {
        const details = req.body;
        const result = await createCase({...details, created_by: req.userID});
    

        res.status(200).json({ message: 'Case created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl NewCase" });
    }
}
export async function FetchAllCases(req, res) {
    try {
        const role = req.role;
        const result = await getAllCases(role);
        res.status(200).json({ message: 'Cases fetched successfully', cases: result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl FetchAllCases" });
    }
}
export async function RemoveCase(req, res) {
    try {
        const caseId = req.caseId;
        const result = await deleteCase(caseId);
        res.status(200).json({ message: 'Case deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl RemoveCase" });
    }
}
export async function FetchCase(req, res) {
    try {
        const caseId = req.params.id;
        const user = req.userID;
        const result = await getCaseDetails(caseId, user);
        res.status(200).json({ message: 'Case fetched successfully', case: result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl FetchCase" });
    }
}
export async function ApproveCase(req, res){
    try{
        const result = await editCase(req.params.caseId, {approval: 'TRUE'});
        res.status(200).json({ message: 'Case approved successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl approveCase" });
    }
}
export async function RejectCase(req, res){
    try{
        const result = await editCase(req.params.caseId, {approval: 'FALSE'});
        res.status(200).json({ message: 'Case Rejected', result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl approveCase" });
    }
}
export async function FetchCaseFiles(req, res){
    try{
        const caseId = req.params.caseId;
        if (role === 'judge'){
            const defFiles = await supabase.storage
                .from(`defendant files`)
                .list(`${caseId}/`);
            
            const pltFiles = await supabase.storage
                .from(`plaintiff files`)
                .getPublicUrl(`${caseId}/`);

            res.status(200).json({ message: 'Case files fetched successfully', files: {plaintiff: pltFiles.data, defendant: defFiles.data}});
            return;
        } else {
            const { data, error } = await supabase.storage
                .from(`${role} files`)
                .getPublicUrl(`${caseId}/`);
            res.status(200).json({ message: 'Case files fetched successfully', files: data});
            return;
        }
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl FetchCaseFiles" });
    }
}
