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
 *     Exame:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do exame
 *         consultaId:
 *           type: string
 *           description: ID da consulta associada
 *         tipo:
 *           type: string
 *           enum: [LABORATORIAL, IMAGEM, CARDIOLOGICO, NEUROLOGICO]
 *           description: Tipo de exame
 *         nome:
 *           type: string
 *           description: Nome do exame
 *         dataExame:
 *           type: string
 *           format: date-time
 *           description: Data e hora da realização do exame
 *         resultado:
 *           type: string
 *           description: Resultado do exame
 *         observacoes:
 *           type: string
 *           description: Observações adicionais do exame
 *       required:
 *         - consultaId
 *         - tipo
 *         - nome
 *         - dataExame
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/exames:
 *   get:
 *     summary: Listar exames
 *     description: Lista de exames, com filtros opcionais por consultaId e tipo
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: consultaId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da consulta
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [LABORATORIAL, IMAGEM, CARDIOLOGICO, NEUROLOGICO]
 *         description: Filtrar por tipo de exame
 *     responses:
 *       200:
 *         description: Lista de exames retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exame'
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
    
    const exames = await prisma.exame.findMany({
      select: {
        id: true,
        consulta: true,
        consultaId: true,
        dataExame: true,
 
      },
      orderBy: { nome: 'asc' }})

    res.json(exames);
  } catch (error) {
    console.error('Erro ao listar exames:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/exames/{id}:
 *   get:
 *     summary: Obter exame específico
 *     description: Retorna os dados completos de um exame específico pelo seu ID
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do exame
 *     responses:
 *       200:
 *         description: Dados do exame retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exame'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Exame não encontrado
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
    const exame = await prisma.exame.findUnique({
      where: { id }
    });
    if (!exame) {
      return res.status(404).json({ message: 'Exame não encontrado' });
    }
    res.json(exame);
  } catch (error) {
    console.error('Erro ao obter exame:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/exames:
 *   post:
 *     summary: Criar novo exame
 *     description: Registra um novo exame médico. Requer perfil MEDICO ou ADMIN
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultaId
 *               - tipo
 *               - nome
 *               - dataExame
 *             properties:
 *               consultaId:
 *                 type: string
 *                 example: clxyz1234567890
 *               tipo:
 *                 type: string
 *                 enum: [LABORATORIAL, IMAGEM, CARDIOLOGICO, NEUROLOGICO]
 *                 example: LABORATORIAL
 *               nome:
 *                 type: string
 *                 example: Hemograma Completo
 *               dataExame:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-20T09:00:00.000Z
 *               resultado:
 *                 type: string
 *                 example: Valores dentro da normalidade
 *               observacoes:
 *                 type: string
 *                 example: Exame realizado em jejum
 *     responses:
 *       201:
 *         description: Exame criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exame'
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
    const { consultaId, tipo, nome, dataExame, resultado, observacoes } = req.body;

    // Opcional: verificar se consultaId existe na tabela consulta

    const novoExame = await prisma.exame.create({
      data: {
        consultaId,
        tipo,
        nome,
        dataExame: new Date(dataExame),
        resultado,
        observacoes
      }
    });
    res.status(201).json(novoExame);
  } catch (error) {
    console.error('Erro ao criar exame:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/exames/{id}:
 *   put:
 *     summary: Atualizar exame
 *     description: Atualiza os dados de um exame existente pelo ID
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do exame
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resultado:
 *                 type: string
 *                 example: Atualização dos resultados
 *               observacoes:
 *                 type: string
 *                 example: Observações adicionais
 *     responses:
 *       200:
 *         description: Exame atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exame'
 *       401:
 *         description: Token inválido ou ausência de permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Exame não encontrado
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

    const exameExistente = await prisma.exame.findUnique({ where: { id } });
    if (!exameExistente) {
      return res.status(404).json({ message: 'Exame não encontrado' });
    }

    const exameAtualizado = await prisma.exame.update({
      where: { id },
      data: updateData
    });
    res.json(exameAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar exame:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/exames/{id}:
 *   delete:
 *     summary: Deletar exame
 *     description: Remove um exame. Requer perfil ADMIN
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do exame
 *     responses:
 *       200:
 *         description: Exame deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Exame deletado com sucesso
 *       401:
 *         description: Token inválido ou ausência de permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Exame não encontrado
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
    const exameDeletado = await prisma.exame.delete({
      where: { id }
    });
    res.json({ message: 'Exame deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar exame:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
