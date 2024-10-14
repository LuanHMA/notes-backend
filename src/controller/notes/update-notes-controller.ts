import { Request, Response } from 'express'
import { tokenValidation } from '../../utils/token-validation'
import { prisma } from '../../config/db'
import z from 'zod'
import { Prisma } from '@prisma/client'

const updateNotesSchema = z.object({
    newTitle: z.string({
        required_error: 'Título é obrigatório!',
        invalid_type_error: 'Título deve ser uma string!',
    }),
    newDescription: z.string({
        required_error: 'Descrinção é obrigatório!',
        invalid_type_error: 'Descrinção deve ser uma string!',
    })
})
export async function updateNotesController(req: Request, res: Response) {
    try {
        const { id } = z.object({ id: z.coerce.number()}).parse(req.params)
        const { authorization } = req.headers
        const { newDescription, newTitle } = updateNotesSchema.parse(req.body)

        const userId = tokenValidation(authorization as string)

        if (userId) {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (user) {
                const notes = await prisma.notes.update({
                    where: {
                        id: id
                    },
                    data: {
                        title: newTitle,
                        description: newDescription,
                        updated_at: new Date()
                    }
                })

                return res.status(200).json({ message: 'Nota atualizada com sucesso!' })
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
            })
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2025':
                    return res.status(404).json({ message: 'Nota não encontrada!' })
            }
        }
        return res.status(500).json({ message: 'Erro interno do servidor', error })
    }
}