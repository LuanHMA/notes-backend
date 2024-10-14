import jwt, { JwtPayload } from "jsonwebtoken";

export function tokenValidation(token: string) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined.');
    }
    
    const user_token = token.split(' ')[1]; 

    const { userId } = jwt.verify(user_token, process.env.JWT_SECRET) as JwtPayload;
    
    return userId;
}