import supabase from "./dbClient.js";
import fs from "fs";

export async function uploadFile(file, role){
    try {
        if (!file) { 
            return {error: 'No file uploaded'}
        }

        const fileData = fs.readFileSync(file.path);
        const fileName = `${Date.now()}_${file.originalname}`;
        
        const { data, error } = await supabase.storage
            .from(`${role} Files`)
            .upload(fileName, fileData, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype
            });
        
        if (error) {
            fs.unlinkSync(file.path); // Clean up temp file
            return { error: error.message, msg: "Upload failed" };
        }
        
        const { data: urlData } = supabase.storage
            .from('Plaintiff Files')
            .getPublicUrl(fileName);
        
        fs.unlinkSync(file.path);
        
        return { 
            success: true,
            path: data.path,
            fileName: fileName,
            url: urlData.publicUrl
        };

        
    } catch (error) {
        if (file?.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        return { error: error.message, msg: "fileServ" };
    }
}

export async function createCase(details){
    try{
        const { data, error } = await supabase
            .from('cases')
            .insert({title: details.title, description: details.desc, created_by: details.created_by, judge_id:details.judge, status: 'OPEN' })
            .select();

        if (error) {
            return { error: error.message, msg: "Create case failed" };
        }
        if (!data || data.length === 0) {
            return { error: "Case creation failed: No data returned", msg: "Create case failed" };
        }

        await supabase
            .from('case_vote_summary')
            .insert({ guilty_count: 0, not_guilty_count: 0, case_id: data[0].id });

        await supabase
            .from('participants')
            .insert([{case_id: data[0].id, user_id: details.judge_id, role:'Judge'},
                     {case_id: data[0].id, user_id: details.created_by, role:'Plaintiff'}])
        console.log('judge added')
        
        return { success: true, caseId: data[0].id };
    } catch (error) {
        return { error: error.message, msg: "fileServ createCase" };
    }
}

export async function getAllCases(){
    try{
        const { data, error } = await supabase
            .from('cases')
            .select('*');
        if (error) return { error: error.message, msg: "Get all cases failed" };
        return { success: true, cases: data };
    } catch (error) {
        return { error: error.message, msg: "fileServ getAllCases" };
    }
}

export async function deleteCase(caseId){
    try{
        const { data, error } = await supabase
            .from('cases')
            .update({ status: 'deleted' })
            .eq('id', caseId);
        if (error) return { error: error.message, msg: "Delete case failed" };
        return { success: true };
    } catch (error) {
        return { error: error.message, msg: "fileServ deleteCase" };
    }
}

export async function editCase(caseId, updates){
    try{
        const { data, error } = await supabase
            .from('cases')
            .update(updates)
            .eq('id', caseId);

        if (error) return { error: error.message, msg: "Edit case failed" };
        return { success: true };

    } catch (error) {
        return { error: error.message, msg: "fileServ editCase" };
    }
}

export async function castVote(party, caseId){
    try{
        if (party === 'guilty') {
            const { data, error } = await supabase
            .from('case_vote_summary')
            .update({ guilty_count: supabase.raw('guilty_count + 1')})
            .eq({case_id: caseId});
            if (error) return { error: error.message, msg: "Cast vote failed" };
            return { success: true };

        } else if (party === 'not_guilty') {
            const { data, error } = await supabase
            .from('case_vote_summary')
            .update({ not_guilty_count: supabase.raw('not_guilty_count + 1')})
            .eq({case_id: caseId});
            if (error) return { error: error.message, msg: "Cast vote failed" };
            return { success: true };
        } else {
            return { error: "Invalid party", msg: "Cast vote failed" };
        }
    } catch (error) {
        return { error: error.message, msg: "fileServ castVote" };
    }
}

export async function joinCase(caseID, userID, role){
    const {data, error} = await supabase
        .from('participants')
        .insert({case_id: caseID, user_id: userID, role:`${role}`})

}

export async function getCaseDetails(caseId, userId){
    try{
        const { data, error } = await supabase
        .from("cases")
        .select(`
            id,
            title,
            description,
            created_by,
            judge_id,
            created_at,

            case_vote_summary (
            guilty_count,
            not_guilty_count
            ),

            participants (
            has_voted
            )
        `)
        .eq("id", caseId)
        .eq("participants.user_id", userId)
        .maybeSingle();

        if (error) throw error;
        const response = {
            id: data.id, 
            title: data.title, 
            description: data.description, created_by: data.created_by, 
            judge_id: data.judge_id,
            created_at: data.created_at,
            files: [],
            votes: data.case_vote_summary,
            userVote: data.participants[0].has_voted
            };
        console.log('response:', response);
        if (error) return { error: error.message, msg: "Get case details failed" };
        return response;
    } catch (error) {
        return { error: error.message, msg: "fileServ getCaseDetails" };
    }
}