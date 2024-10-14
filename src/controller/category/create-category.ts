import { Request, Response } from 'express'
import z from 'zod';
import { prisma } from '../../config/db';

const createCategorySchema = z.object({
    name: z.string({
        required_error: 'Nome é obrigatório!',
        invalid_type_error: 'Nome deve ser uma string!',
    }),
})

export async function createCategoryController(req: Request, res: Response) {
    try{
        const { name } = createCategorySchema.parse(req.body)

      
    }
    catch(error){
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