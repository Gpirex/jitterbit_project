import express from "express";
import { Order } from "../models/order.js";
import { Item } from "../models/item.js";
import { authMiddleware } from "../domain/auth.js";

const router = express.Router();

// ========================================================================
// SCHEMAS SWAGGER
// ========================================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemInput:
 *       type: object
 *       required:
 *         - idItem
 *         - quantidadeItem
 *         - valorItem
 *       properties:
 *         idItem:
 *           type: string
 *           example: "2434"
 *         quantidadeItem:
 *           type: integer
 *           example: 1
 *         valorItem:
 *           type: number
 *           example: 1000
 *
 *     OrderInput:
 *       type: object
 *       required:
 *         - numeroPedido
 *         - valorTotal
 *         - dataCriacao
 *         - items
 *       properties:
 *         numeroPedido:
 *           type: string
 *           example: "v10089015vdb-01"
 *         valorTotal:
 *           type: number
 *           example: 10000
 *         dataCriacao:
 *           type: string
 *           example: "2023-07-19T12:24:11.5299601+00:00"
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ItemInput"
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           example: "v10089015vdb"
 *         value:
 *           type: number
 *           example: 10000
 *         creationDate:
 *           type: string
 *           example: "2023-07-19T12:24:11.529Z"
 *         Items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 example: 2434
 *               quantity:
 *                 type: number
 *                 example: 1
 *               price:
 *                 type: number
 *                 example: 1000
 */

// ========================================================================
// FUNÇÃO DE MAPEAMENTO
// ========================================================================
function mapBodyToModel(body) {
    if (!body || !body.numeroPedido || !body.items) {
        throw new Error("Dados inválidos para criar/atualizar pedido");
    }

    return {
        orderId: body.numeroPedido.replace("-01", ""),
        value: body.valorTotal,
        creationDate: new Date(body.dataCriacao),
        items: body.items.map(item => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
}

// ========================================================================
// CRIAR PEDIDO
// ========================================================================

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/OrderInput"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderResponse"
 */
router.post("/order", authMiddleware, async (req, res) => {
    try {
        const data = mapBodyToModel(req.body);

        const order = await Order.create(
            {
                orderId: data.orderId,
                value: data.value,
                creationDate: data.creationDate,
                Items: data.items
            },
            { include: [Item] }
        );

        return res.status(201).json(order);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// ========================================================================
// LISTAR PEDIDOS
// ========================================================================

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/order/list", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.findAll({ include: Item });
        return res.json(orders);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ========================================================================
// BUSCAR PEDIDO POR ID
// ========================================================================

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089015vdb"
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/order/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, { include: Item });

        if (!order) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        return res.json(order);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// ========================================================================
// ATUALIZAR PEDIDO
// ========================================================================

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 */
router.put("/order/:id", authMiddleware, async (req, res) => {
    try {
        const data = mapBodyToModel(req.body);

        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        await Order.update(
            {
                value: data.value,
                creationDate: data.creationDate
            },
            { where: { orderId: req.params.id } }
        );

        await Item.destroy({ where: { orderId: req.params.id } });

        for (const item of data.items) {
            await Item.create({
                ...item,
                orderId: req.params.id
            });
        }

        return res.json({ message: "Pedido atualizado" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// ========================================================================
// DELETAR PEDIDO
// ========================================================================

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Deleta um pedido
 *     security:
 *       - bearerAuth: []
 *     tags: [Orders]
 */
router.delete("/order/:id", authMiddleware, async (req, res) => {
    try {
        const deleted = await Order.destroy({ where: { orderId: req.params.id } });

        if (!deleted) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        return res.json({ message: "Pedido deletado" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
