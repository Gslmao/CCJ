import supabase from './dbClient.js';

export async function signIn(email, password) {
    console.log('Signing in user with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
        email, 
        password, 
        options: {
            data: { username: username }
        }
    });
        if (error) throw error;
        return data.user;
}

export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
}   