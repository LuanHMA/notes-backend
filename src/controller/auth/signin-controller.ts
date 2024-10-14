import z from "zod";
import { prisma } from "../../config/db";
import { Request, Response } from 'express';
import { generateToken } from "../../utils/generate-token";
import { comparePassword } from "../../utils/password-encryption";


const bodySchema = z.object({
  email: z.string({
    required_error: 'Email é obrigatório!',
    invalid_type_error: 'Email deve ser uma string!',
  }).email('E-mail inválido!'),
  password: z.string({
    required_error: 'Senha é obrigatória!',
    invalid_type_error: 'Senha deve ser uma string!',
  }).min(1, 'Senha é obrigatória')
});

export async function signInController(req: Request, res: Response) {
  try {
    const { email, password } = bodySchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const passwordIsCorrect = await comparePassword(password, user.password);

    if (!passwordIsCorrect) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = generateToken({ userId: user.id, expiresIn: '1h' });
    return res.status(200).json({ token, message: 'Usuário logado com sucesso!' });
    
  } catch (error) {
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