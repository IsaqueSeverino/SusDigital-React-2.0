import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();
import AuthMiddleware from '../middlewares/auth.js';

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Prontuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do prontuário
 *         pacienteId:
 *           type: string
 *           description: ID do paciente
 *         diagnostico:
 *           type: string
 *           description: Diagnóstico médico
 *         sintomas:
 *           type: string
 *           description: Sintomas relatados
 *         tratamento:
 *           type: string
 *           description: Tratamento prescrito
 *         observacoes:
 *           type: string
 *           description: Observações adicionais
 *       required:
 *         - pacienteId
 *         - diagnostico
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/prontuarios:
 *   get:
 *     summary: Listar prontuários
 *     description: Retorna lista de prontuários com filtro opcional por pacienteId
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pacienteId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do paciente
 *     responses:
 *       200:
 *         description: Lista de prontuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prontuario'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', async (req, res) => {
  try {
    const { pacienteId } = req.query;
    
    const where = pacienteId ? { pacienteId: String(pacienteId) } : {};

    const prontuarios = await prisma.prontuario.findMany({
      where,
      select: {
        id: true,
        pacienteId: true,
        data: true,
        diagnostico: true,
        sintomas: true,
        tratamento: true,
        observacoes: true,
        medicacoes: true
      },

      orderBy: { data: 'desc' }
    });

    res.json(prontuarios);
  } catch (error) {
    console.error('Erro ao listar prontuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/prontuarios/{id}:
 *   get:
 *     summary: Obter prontuário específico
 *     description: Retorna os dados completos de um prontuário específico pelo seu ID
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do prontuário
 *     responses:
 *       200:
 *         description: Dados do prontuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prontuario'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Prontuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prontuario = await prisma.prontuario.findUnique({
      where: { id }
    });
    if (!prontuario) {
      return res.status(404).json({ message: 'Prontuário não encontrado' });
    }
    res.json(prontuario);
  } catch (error) {
    console.error('Erro ao obter prontuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/prontuarios:
 *   post:
 *     summary: Criar novo prontuário
 *     description: Cria um novo prontuário médico. Requer perfil MEDICO ou ADMIN
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *               - diagnostico
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 example: clxyz1234567890
 *               diagnostico:
 *                 type: string
 *                 example: Hipertensão arterial sistêmica
 *               sintomas:
 *                 type: string
 *                 example: Dores de cabeça, tontura
 *               tratamento:
 *                 type: string
 *                 example: Medicação anti-hipertensiva
 *               observacoes:
 *                 type: string
 *                 example: Paciente apresenta melhora
 *     responses:
 *       201:
 *         description: Prontuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prontuario'
 *       401:
 *         description: Token inválido ou ausência de permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', async (req, res) => {
  try {
    const { pacienteId, diagnostico, sintomas, tratamento, observacoes } = req.body;
    const novoProntuario = await prisma.prontuario.create({
      data: {
        pacienteId,
        diagnostico,
        sintomas,
        tratamento,
        observacoes
      }
    });
    res.status(201).json(novoProntuario);
  } catch (error) {
    console.error('Erro ao criar prontuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/prontuarios/{id}:
 *   put:
 *     summary: Atualizar prontuário
 *     description: Atualiza um prontuário existente pelo ID
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do prontuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnostico:
 *                 type: string
 *               sintomas:
 *                 type: string
 *               tratamento:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prontuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prontuario'
 *       401:
 *         description: Token inválido ou ausência de permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Prontuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const prontuarioExistente = await prisma.prontuario.findUnique({ where: { id } });
    if (!prontuarioExistente) {
      return res.status(404).json({ message: 'Prontuário não encontrado' });
    }

    const prontuarioAtualizado = await prisma.prontuario.update({
      where: { id },
      data: updateData
    });
    res.json(prontuarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar prontuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/prontuarios/{id}:
 *   delete:
 *     summary: Deletar prontuário
 *     description: Remove um prontuário. Requer perfil ADMIN
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do prontuário
 *     responses:
 *       200:
 *         description: Prontuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Prontuário deletado com sucesso
 *       401:
 *         description: Token inválido ou ausência de permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Prontuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prontuarioDeletado = await prisma.prontuario.delete({
      where: { id }
    });
    res.json({ message: 'Prontuário deletado com sucesso' });
  } catch (error) {

    console.error('Erro ao deletar prontuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
