import { Request, Response } from 'express'
import { tokenValidation } from '../../utils/token-validation'
import { prisma } from '../../config/db'
import z from 'zod'
import { Prisma } from '@prisma/client'

const deleteNoteSchema = z.object({
    id: z.coerce.number({
        required_error: 'Id é obrigatório!',
        invalid_type_error: 'Id deve ser uma string!',
    })
})
export async function deleteNoteController(req: Request, res: Response) {
    try {

        const { id } = deleteNoteSchema.parse(req.params)
        const { authorization } = req.headers

        const userId = tokenValidation(authorization as string)

        if (userId) {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (user) {
                const notes = await prisma.notes.delete({
                    where: {
                        id: id
                    }
                })

                return res.status(200).json({ message: 'Nota excluída com sucesso!' })
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
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case 'P2025':
                    return res.status(404).json({ message: 'Nota não encontrada!' })
            }
        }
        return res.status(500).json({ message: 'Erro interno do servidor', error })
    }
}