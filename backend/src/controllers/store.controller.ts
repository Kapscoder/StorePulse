import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// ── GET /api/stores ──────────────────────────────────────────────
// Normal users: list all stores with their overall rating + user's own rating
export const getStores = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'asc', page = '1', limit = '10' } = req.query as Record<string, string>;
    const userId = req.user!.id;

    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const validSortFields = ['name', 'address'];
    const orderBy = validSortFields.includes(sortBy) ? { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' } : { name: 'asc' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        select: {
          id: true, name: true, address: true, email: true,
          ratings: {
            select: { rating: true, userId: true },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.store.count({ where }),
    ]);

    const result = stores.map((store) => {
      const overallRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : null;
      const userRating = store.ratings.find((r) => r.userId === userId)?.rating ?? null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        overallRating,
        userRating,
      };
    });

    res.json({ stores: result, total, page: parseInt(page), limit: take });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
