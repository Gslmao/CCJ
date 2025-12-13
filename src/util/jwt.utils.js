import supabase from '../services/dbClient.js';

export async function verifyToken(token){       
    try {
        return await supabase.auth.getUser(token);
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
}