"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const databaseConnection_1 = __importDefault(require("./databaseConnection"));
const router = express_1.default.Router();
const databaseConnection = new databaseConnection_1.default();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
      SELECT
        c.id AS cartId,
        c.active,
        c.userId,
        c.subtotal,
        c.discounts,
        c.taxes,
        c.total,
        i.id AS itemId,
        i.name AS itemName,
        i.price,
        i.description,
        ci.quantity
      FROM
        Cart c
      LEFT JOIN
        Cart_Item ci ON c.id = ci.cartId
      LEFT JOIN
        Item i ON ci.itemId = i.id
    `;
        const rows = yield databaseConnection.executeQuery(query);
        const result = rows.reduce((acc, row) => {
            const existingCart = acc.find((cart) => cart.cartId === row.cartId);
            const itemDetails = {
                itemId: row.itemId,
                itemName: row.itemName,
                price: row.price,
                description: row.description,
                quantity: row.quantity,
            };
            if (existingCart) {
                existingCart.items.push(itemDetails);
            }
            else {
                acc.push({
                    cartId: row.cartId,
                    active: row.active,
                    userId: row.userId,
                    subtotal: row.subtotal,
                    discounts: row.discounts,
                    taxes: row.taxes,
                    total: row.total,
                    items: [itemDetails],
                });
            }
            return acc;
        }, []);
        res.json(result);
    }
    catch (error) {
        console.error('Error retrieving shopping carts:', error);
        res.status(500).json({ error: 'Error retrieving shopping carts' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartId = parseInt(req.params.id, 10);
    if (isNaN(cartId)) {
        res.status(400).json({ error: 'Invalid cart ID' });
        return;
    }
    try {
        const query = `
      SELECT
        c.id AS cartId,
        c.active,
        c.userId,
        c.subtotal,
        c.discounts,
        c.taxes,
        c.total,
        i.id AS itemId,
        i.name AS itemName,
        i.price,
        i.description,
        ci.quantity
      FROM
        Cart c
      LEFT JOIN
        Cart_Item ci ON c.id = ci.cartId
      LEFT JOIN
        Item i ON ci.itemId = i.id
      WHERE
        c.id = ?
    `;
        const rows = yield databaseConnection.executeQuery(query, [cartId]);
        if (rows.length > 0) {
            const cartDetails = rows.reduce((acc, row) => {
                const itemDetails = {
                    itemId: row.itemId,
                    itemName: row.itemName,
                    price: row.price,
                    description: row.description,
                    quantity: row.quantity,
                };
                if (acc.cartId === undefined) {
                    acc.cartId = row.cartId;
                    acc.active = row.active;
                    acc.userId = row.userId;
                    acc.subtotal = row.subtotal;
                    acc.discounts = row.discounts;
                    acc.taxes = row.taxes;
                    acc.total = row.total;
                    acc.items = [itemDetails];
                }
                else {
                    acc.items.push(itemDetails);
                }
                return acc;
            }, {});
            res.json(cartDetails);
        }
        else {
            res.status(404).json({ error: 'Cart not found' });
        }
    }
    catch (error) {
        console.error('Error retrieving cart by ID:', error);
        res.status(500).json({ error: 'Error retrieving cart by ID' });
    }
}));
exports.default = router;
