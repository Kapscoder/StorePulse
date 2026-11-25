import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// ── POST /api/ratings ────────────────────────────────────────────
export const submitRating = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user!.id;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    // Upsert: create if not exists, update if already rated
    const result = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { rating: parseFloat(rating) },
      create: { userId, storeId, rating: parseFloat(rating) },
    });

    res.status(201).json({ message: 'Rating submitted', rating: result });
  } catch {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

// ── PUT /api/ratings/:storeId ────────────────────────────────────
export const updateRating = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user!.id;

    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId } },
    });

    if (!existing) {
      res.status(404).json({ error: 'You have not rated this store yet' });
      return;
    }

    const updated = await prisma.rating.update({
      where: { userId_storeId: { userId, storeId } },
      data: { rating: parseFloat(rating) },
    });

    res.json({ message: 'Rating updated', rating: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update rating' });
  }
};
