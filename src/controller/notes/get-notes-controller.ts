import { Request, Response } from 'express'
import z from 'zod'
import { prisma } from '../../config/db'
import { tokenValidation } from '../../utils/token-validation'

export async function getNotesController(req: Request, res: Response) {
    try {
        const { authorization } = req.headers

        const userId = tokenValidation(authorization as string)
        

        if (userId) {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })


            if (user) {
                const notes = await prisma.notes.findMany({
                    where: {
                        userId: user.id
                    }
                })

                return res.status(200).json({ notes })
            }

        }

        return res.status(404).json({ message: 'Usário não encontrado!' })
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: error.errors.map(e => ({
                    message: e.message
                }))
            });
        }
        return res.status(500).json({ message: 'Erro interno do servidor', error });
    }
}