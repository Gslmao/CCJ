import { uploadFile, createCase, getAllCases, deleteCase, getCaseDetails } from "../services/fileServ.js";

export async function SubmitCase(req, res) {
    try {
        const file = req.file;
        const userId = req.userID;
        const result = await uploadFile(userId, file, req.role);
        res.status(200).json({ message: 'File uploaded successfully', result });
    } catch (error) {
        res.status(500).json({ error1: error.message, msg: "fileCntrl" });
    }
}
export async function NewCase(req, res) {
    try {
        const details = req.body;
        console.log('details:', details);
        const result = await createCase({...details, created_by: req.userID});
        console.log('hello')

        res.status(200).json({ message: 'Case created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message, msg: "fileCntrl NewCase" });
    }
}
export async function FetchAllCases(req, res) {
    try {
        const result = await getAllCases();
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