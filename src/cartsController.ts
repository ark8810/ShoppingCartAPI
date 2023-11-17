import express, { Request, Response } from 'express';
import DatabaseConnection from './databaseConnection';

const router = express.Router();
const databaseConnection = new DatabaseConnection();

router.get('/', async (req: Request, res: Response) => {
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
    const rows: any[] = await databaseConnection.executeQuery(query);

    const result: CartDetails[] = rows.reduce((acc: CartDetails[], row) => {
      const existingCart = acc.find((cart) => cart.cartId === row.cartId);
      const itemDetails: CartItem = {
        itemId: row.itemId,
        itemName: row.itemName,
        price: row.price,
        description: row.description,
        quantity: row.quantity,
      };

      if (existingCart) {
        existingCart.items.push(itemDetails);
      } else {
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
  } catch (error) {
    console.error('Error retrieving shopping carts:', error);
    res.status(500).json({ error: 'Error retrieving shopping carts' });
  }
});


router.get('/:id', async (req: Request, res: Response) => {
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
    const rows: any[] = await databaseConnection.executeQuery(query, [cartId]);

    if (rows.length > 0) {
      const cartDetails: CartDetails = rows.reduce((acc: CartDetails, row) => {
        const itemDetails: CartItem = {
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
        } else {
          acc.items.push(itemDetails);
        }

        return acc;
      }, {});

      res.json(cartDetails);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error retrieving cart by ID:', error);
    res.status(500).json({ error: 'Error retrieving cart by ID' });
  }
});

export default router;