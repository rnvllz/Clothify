import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import supabase from '../config/supabase';
import { upload } from '../config/cloudinary';
import { adminAuth } from '../middleware/auth';
import { ProductInsert, ProductUpdate } from '../types/database';

const router = Router();

// GET all products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST new product
router.post('/', adminAuth, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = req.file?.path || null;

    const productData: ProductInsert = {
      id: nanoid(10),
      title,
      description: description || null,
      price: parseFloat(price),
      image: imageUrl,
    };

    const { data: product, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ ok: true, product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT - update product
router.put('/:id', adminAuth, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price } = req.body;
    const updateData: ProductUpdate = {
      title,
      description: description || null,
      price: parseFloat(price)
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ ok: true, product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE - remove product
router.delete('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
