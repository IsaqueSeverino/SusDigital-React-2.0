import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
const router = express.Router();
import AuthMiddleware from '../middlewares/auth.js';

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * /api/medicos:
 *   get:
 *     summary: Listar todos os médicos
 *     description: Retorna uma lista com todos os médicos cadastrados no sistema. Disponível para todos os usuários autenticados
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: especialidade
 *         schema:
 *           type: string
 *         description: Filtrar por especialidade médica
 *         example: Cardiologia
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Buscar por nome do médico (busca parcial)
 *         example: Silva
 *     responses:
 *       200:
 *         description: Lista de médicos retornada com sucesso
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
 *                     example: Dr. João Silva
 *                   crm:
 *                     type: string
 *                     example: CRM/SP 123456
 *                   especialidade:
 *                     type: string
 *                     example: Cardiologia
 *                   telefone:
 *                     type: string
 *                     nullable: true
 *                     example: (11) 98765-4321
 *       401:
 *         description: Token inválido ou ausente
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
router.get('/', async (req, res) => {
  try {
    const medicos = await prisma.medico.findMany({
      select: {
        id: true,
        nome: true,
        crm: true,
        especialidade: true,
        telefone: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(medicos);
  } catch (error) {
    console.error('Erro ao listar médicos:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/medicos/{id}:
 *   get:
 *     summary: Obter médico específico
 *     description: Retorna os dados completos de um médico específico pelo seu ID. Disponível para todos os usuários autenticados
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do médico
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados do médico retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Medico'
 *                 - type: object
 *                   properties:
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: medico@exemplo.com
 *                         ativo:
 *                           type: boolean
 *                           example: true
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Médico não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Médico não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const medico = await prisma.medico.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { email: true, ativo: true }
        }
      }
    });

    if (!medico) {
      return res.status(404).json({ erro: 'Médico não encontrado' });
    }

    res.json({
        ...medico,
        email: medico.usuario?.email
    });
  } catch (error) {
    console.error('Erro ao obter médico:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/medicos:
 *   post:
 *     summary: Criar novo médico
 *     description: Cria um novo usuário e o registro de médico vinculado. Requer perfil ADMIN.
 *     tags: [Médicos]
 */
router.post('/', AuthMiddleware.authorize('ADMIN'), async (req, res) => {
  try {
    const { nome, crm, especialidade, telefone, email } = req.body;

    if (!nome || !crm || !especialidade || !email) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, crm, especialidade, email' });
    }

    const existingCrm = await prisma.medico.findUnique({ where: { crm } });
    if (existingCrm) {
      return res.status(400).json({ erro: 'CRM já cadastrado' });
    }

    const existingEmail = await prisma.usuario.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash('mudar123', 10);

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email,
          senha: hashedPassword,
          tipo: 'MEDICO',
          ativo: true
        }
      });

      const medico = await tx.medico.create({
        data: {
          nome,
          crm,
          especialidade,
          telefone,
          usuarioId: usuario.id
        }
      });

      return medico;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar médico:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/medicos/{id}:
 *   put:
 *     summary: Atualizar médico
 *     description: Atualiza os dados de um médico existente. Requer perfil ADMIN.
 *     tags: [Médicos]
 */
router.put('/:id', AuthMiddleware.authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, crm, especialidade, telefone, email } = req.body;

    const medicoExistente = await prisma.medico.findUnique({ where: { id } });
    if (!medicoExistente) {
      return res.status(404).json({ erro: 'Médico não encontrado' });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Atualizar dados do Médico
      await tx.medico.update({
        where: { id },
        data: {
          nome,
          crm,
          especialidade,
          telefone
        }
      });

      // 2. Atualizar email do Usuario se fornecido e diferente
      if (email) {
        if (medicoExistente.usuarioId) {
             try {
                await tx.usuario.update({
                    where: { id: medicoExistente.usuarioId },
                    data: { email }
                });
             } catch (e: any) {
                 if (e.code === 'P2002') {
                    throw new Error('Email já em uso por outro usuário');
                 }
                 throw e; 
             }
        }
      }
    });

    const medicoAtualizado = await prisma.medico.findUnique({
         where: { id },
         include: { usuario: { select: { email: true } } }
    });

    res.json({
        ...medicoAtualizado,
        email: medicoAtualizado?.usuario?.email,
        usuario: undefined
    });

  } catch (error: any) {
    console.error('Erro ao atualizar médico:', error);
    if (error.message === 'Email já em uso por outro usuário') {
        return res.status(400).json({ erro: 'Email já em uso' });
    }
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/medicos/{id}:
 *   delete:
 *     summary: Excluir médico
 *     description: Exclui um médico e seu usuário associado. Não é possível excluir se houver consultas vinculadas. Requer perfil ADMIN.
 *     tags: [Médicos]
 */
router.delete('/:id', AuthMiddleware.authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const medico = await prisma.medico.findUnique({
      where: { id },
      include: { _count: { select: { consultas: true } } }
    });

    if (!medico) {
      return res.status(404).json({ erro: 'Médico não encontrado' });
    }

    if (medico._count.consultas > 0) {
      return res.status(400).json({ erro: 'Não é possível excluir médico com consultas vinculadas' });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete Medico
      await tx.medico.delete({ where: { id } });

      // 2. Delete Usuario
      if (medico.usuarioId) {
        await tx.usuario.delete({ where: { id: medico.usuarioId } });
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir médico:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;