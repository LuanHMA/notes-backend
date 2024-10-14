import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
config()

export function generateToken({ userId, expiresIn }: { userId: number, expiresIn: string | number}){
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
      
    const token = jwt.sign({ userId }, process.env.JWT_SECRET! , { expiresIn })
    return token;
}