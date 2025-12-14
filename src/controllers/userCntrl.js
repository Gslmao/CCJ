import { signIn, signUp } from '../services/auth.js';


export async function Login(req, res) {
    const { email, password } = req.body;
    try {
        const data = await signIn(email, password);
        const response = { token: data?.session?.access_token, user_id:data?.user.id, role: data?.user.user_metadata.role, user: data?.user.user_metadata.username };
        res.status(200).json(response);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

export async function Signup(req, res) {

    console.log('content-type:', req.headers['content-type']);
    console.log('raw-body-present?', typeof req.body, req.body);

    const { email, password, role, username } = req.body;
    console.log(role);
    try {
        const user = await signUp(email, password, username, role);
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ error: error.message, msg: "Signup failed1" });
    }
}