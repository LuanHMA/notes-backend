import { Request, Response } from 'express'
import z from 'zod'
import { prisma } from '../../config/db'
import { JsonWebTokenError } from 'jsonwebtoken'
import { tokenValidation } from '../../utils/token-validation'

const createNoteSchema = z.object({
    title: z.string({
        required_error: 'Título é obrigatório!',
        invalid_type_error: 'Título deve ser uma string!',
    }),
    description: z.string({
        required_error: 'Descrinção é obrigatório!',
        invalid_type_error: 'Descrinção deve ser uma string!',
    }),
})

export async function createNoteController(req: Request, res: Response) {
    try {
        const { title, description } = createNoteSchema.parse(req.body)
        const { authorization } = req.headers

        const userId = tokenValidation(authorization as string)

        if (userId) {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (user) {
                await prisma.notes.create({
                    data: {
                        title,
                        description,
                        userId: user.id
                    }
                })

                return res.status(200).json({ title, description })
            }
        }

        return res.status(404).json({ message: 'Usário não encontrado!' })
    }
    catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: error.errors.map(e => ({
                    message: e.message
                }))
            });
        }
        else if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        return res.status(500).json({ message: 'Erro interno do servidor', error });
    }
}