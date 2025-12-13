export function detExtLogin(req, res, next) {
    const body = req.body || {};
    req.details = {
        email: body.email, 
        password: body.password, 
        role: body.role,
        username: body.username
    };
    next();
}

export default function detExtCase(req, res, next) {
    const body = req.body || {};
    req.detailsC = {
        title: body.caseTitle, 
        description: body.caseDescription, 
        judge_id: body.judgeId
    };
    next();
}