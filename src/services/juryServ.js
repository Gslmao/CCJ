import supabase from "./dbClient.js";

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
export async function getCaseResults(caseId){
    try{
        const { data, error } = await supabase
            .from('case_vote_summary')
            .select('guilty_count, not_guilty_count')
            .eq('case_id', caseId)
            .single();

        if (error) return { error: error.message, msg: "Get case results failed" };
        return data;
    } catch (error) {
        return { error: error.message, msg: "fileServ getCaseResults" };
    }
}