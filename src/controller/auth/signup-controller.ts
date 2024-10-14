import z from "zod"
import { Request, Response } from 'express'
import { prisma } from "../../config/db"

import { Prisma } from "@prisma/client"
import { hashPassword } from "../../utils/password-encryption";
import { generateToken } from "../../utils/generate-token";

const signupSchema = z.object({
    name: z.string({
      required_error: 'Nome é obrigatório!',
      invalid_type_error: 'Nome deve ser uma string!',
    }),
    email: z.string({
      required_error: 'Email é obrigatório!',
      invalid_type_error: 'Email deve ser uma string!',
    }).email('E-mail inválido!'),
    password: z.string({
      required_error: 'Senha é obrigatória!',
      invalid_type_error: 'Senha deve ser uma string!',
    }).min(1, 'Senha é obrigatória')
  });
  
export async function signUpController(req: Request, res: Response) {
    try {
        const { name, email, password } = signupSchema.parse(req.body);

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword    
            }
        })

        const token = generateToken({ userId: user.id, expiresIn: '1h' })

        return res.json({ message: 'Usuário cadastrado com sucesso!', token })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: error.errors.map(e => ({
                    message: e.message
                }))
            });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':  // Código de erro de violação de chave única (unique constraint)
                    return res.status(409).json({ message: 'Usuário já cadastrado!', error });
                case 'P2003':  // Erro de chave estrangeira
                    return res.status(400).json({ message: 'Violação de chave estrangeira!', error });
                // Adicione outros códigos de erro conforme necessário
                default:
                    return res.status(500).json({ message: 'Erro desconhecido ao acessar o banco de dados!', error });
            }
        }
        else if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({ message: 'Erro de validação no Prisma!', error });
        }
        else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            return res.status(500).json({ message: 'Erro desconhecido no Prisma!', error });
        }
        else if (error instanceof Prisma.PrismaClientRustPanicError) {
            return res.status(500).json({ message: 'Erro interno do Prisma!', error });
        }
        else {
            return res.status(500).json({ message: 'Erro ao cadastrar o usuário!', error });
        }
    }
}