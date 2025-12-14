export default async function roleCheck(...roles){
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.sendStatus(403)
        }
        next();
    }
}