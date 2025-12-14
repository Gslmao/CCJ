import supabase from '../services/dbClient.js';

export async function authVerify(req, res, next){
    const reqHead = req.headers['authorization'];
    if (!reqHead) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }
    const token = reqHead.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    try {
        const payload = await supabase.auth.getUser(token);
        req.role = payload.data.user.user_metadata.role;
        req.userID = payload.data.user.id;
        next();
        
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}