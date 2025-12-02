import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import supabase from '../config/supabase';
import { OrderInsert } from '../types/database';

const router = Router();

// POST - create new order
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_name, customer_email, items, total } = req.body;

    if (!customer_name || !customer_email || !items || !total) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const orderData: OrderInsert = {
      id: nanoid(10),
      customer_name,
      customer_email,
      items,
      total: parseFloat(total)
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ ok: true, id: order.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
