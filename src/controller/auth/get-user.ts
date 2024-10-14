import { Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { User } from '@prisma/client';

type JwtPayload = {
    userId?: number
}

export async function getUserController(req: Request, res: Response) {
    try{
        const { authorization } = req.headers
    
        const token = authorization?.split(' ')[1]
    
        const { userId } = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload
    
        const { password, ...data } = await prisma.user.findUnique({ 
            where: {
                id: userId
            }
        }) as User
    
        return res.status(200).json({ data })
    }
    catch (error) {
        if(error instanceof JsonWebTokenError){
            switch(error.message){
                case 'invalid token':
                    return res.status(401).json({ message: 'Token inválido!'})
                case 'jwt expired': 
                    return res.status(401).json({ message: 'Token expirado!'})
                case 'jwt malformed': 
                    return res.status(401).json({ message: 'Token malinformado!' })
                case 'jwt signature is required':
                    return res.status(401).json({ message: 'O Token não possui assinatura!' })
                case 'invalid signature':
                    return res.status(401).json({ message: 'Assinatura inválida!'})
                default: return res.status(401).json({error})
            }
            
        }

        
        return res.status(500).json({ message: 'Erro interno do servidor', error });
    }
    finally{
    prisma.$disconnect()
    }
}