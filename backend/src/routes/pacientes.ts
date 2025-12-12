import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import AuthMiddleware from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Listar todos os pacientes
 *     description: Retorna uma lista com todos os pacientes cadastrados. Requer perfil ADMIN ou MEDICO
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Buscar por nome do paciente (busca parcial)
 *         example: Maria
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: Buscar por CPF do paciente
 *         example: 123.456.789-00
 *       - in: query
 *         name: cartaoSus
 *         schema:
 *           type: string
 *         description: Buscar por número do Cartão SUS
 *         example: 123 4567 8901 2345
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: clxyz1234567890
 *                   nome:
 *                     type: string
 *                     example: Maria Santos
 *                   cpf:
 *                     type: string
 *                     example: 123.456.789-00
 *                   cartaoSus:
 *                     type: string
 *                     nullable: true
 *                     example: 123 4567 8901 2345
 *                   telefone:
 *                     type: string
 *                     nullable: true
 *                     example: (11) 91234-5678
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - requer perfil ADMIN ou MEDICO
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', AuthMiddleware.authorize('ADMIN', 'MEDICO'), async (req, res) => {
  try {
    const { q } = req.query;

    const where: any = {};
    
    if (q) {
      const termo = String(q);
      where.OR = [
        { nome: { contains: termo, mode: 'insensitive' } },
        { cpf: { contains: termo } },
        { cartaoSus: { contains: termo } },
        { usuario: { email: { contains: termo, mode: 'insensitive' } } }
      ];
    }

    const pacientesRaw = await prisma.paciente.findMany({
      where,
      select: {
        id: true,
        nome: true,
        cpf: true,
        cartaoSus: true,
        telefone: true,
        dataNascimento: true,
        usuario: {
          select: {
            email: true
          }
        }
      },
      orderBy: { nome: 'asc' }
    });

    const pacientes = pacientesRaw.map(p => ({
      ...p,
      email: p.usuario?.email,
      usuario: undefined
    }));

    res.json(pacientes);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obter paciente específico
 *     description: Retorna os dados completos de um paciente específico pelo seu ID. Requer perfil ADMIN ou MEDICO
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do paciente
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados do paciente retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - requer perfil ADMIN ou MEDICO
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Paciente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', AuthMiddleware.authorize('ADMIN', 'MEDICO'), async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { email: true, ativo: true }
        }
      }
    });

    if (!paciente) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.json({
        ...paciente,
        email: paciente.usuario?.email
    });
  } catch (error) {
    console.error('Erro ao obter paciente:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Criar novo paciente
 *     description: Cria um novo usuário e o registro de paciente vinculado. Requer perfil ADMIN ou MEDICO.
 *     tags: [Pacientes]
 */
router.post('/', AuthMiddleware.authorize('ADMIN', 'MEDICO'), async (req, res) => {
  try {
    const { nome, cpf, dataNascimento, email, telefone, endereco, cartaoSus } = req.body;

    if (!nome || !cpf || !dataNascimento) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, cpf, dataNascimento' });
    }

    const existingCpf = await prisma.paciente.findUnique({ where: { cpf } });
    if (existingCpf) {
      return res.status(400).json({ erro: 'CPF já cadastrado' });
    }

    if (email) {
      const existingEmail = await prisma.usuario.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
    }

    const hashedPassword = await bcrypt.hash('mudar123', 10);
    // Se não tiver email, gera um email fictício baseado no CPF para login
    const userEmail = email || `paciente.${cpf.replace(/\D/g, '')}@sistema.local`;

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: userEmail,
          senha: hashedPassword,
          tipo: 'PACIENTE',
          ativo: true
        }
      });

      const paciente = await tx.paciente.create({
        data: {
          nome,
          cpf,
          dataNascimento: new Date(dataNascimento),
          telefone,
          endereco,
          cartaoSus,
          usuarioId: usuario.id
        }
      });

      return paciente;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Atualizar paciente
 *     description: Atualiza os dados de um paciente existente. Requer perfil ADMIN ou MEDICO.
 *     tags: [Pacientes]
 */
router.put('/:id', AuthMiddleware.authorize('ADMIN', 'MEDICO'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, dataNascimento, email, telefone, endereco, cartaoSus } = req.body;

    const pacienteExistente = await prisma.paciente.findUnique({ where: { id } });
    if (!pacienteExistente) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Atualizar dados do Paciente
      await tx.paciente.update({
        where: { id },
        data: {
          nome,
          cpf,
          dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
          telefone,
          endereco,
          cartaoSus
        }
      });

      // 2. Atualizar email do Usuario se fornecido e diferente
      if (email) {
        // Verificar se usuário existe para esse paciente
        if (pacienteExistente.usuarioId) {
             try {
                // Tenta atualizar. Se der erro de unique constraint, cai no catch
                await tx.usuario.update({
                    where: { id: pacienteExistente.usuarioId },
                    data: { email }
                });
             } catch (e: any) {
                 // Prisma error code for unique constraint P2002
                 if (e.code === 'P2002') {
                    throw new Error('Email já em uso por outro usuário');
                 }
                 throw e; 
             }
        }
      }
    });

    // Retornar dados atualizados
    const pacienteAtualizado = await prisma.paciente.findUnique({
         where: { id },
         include: { usuario: { select: { email: true } } }
    });

    res.json({
        ...pacienteAtualizado,
        email: pacienteAtualizado?.usuario?.email,
        usuario: undefined
    });

  } catch (error: any) {
    console.error('Erro ao atualizar paciente:', error);
    if (error.message === 'Email já em uso por outro usuário') {
        return res.status(400).json({ erro: 'Email já em uso' });
    }
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
