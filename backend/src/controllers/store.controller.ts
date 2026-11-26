import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { Prisma } from '@prisma/client';

// ── GET /api/stores ──────────────────────────────────────────────
export const getStores = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name, address,
      sortBy = 'name', sortOrder = 'asc',
      page = '1', limit = '10',
    } = req.query as Record<string, string>;

    const userId = req.user!.id;

    const where: Prisma.StoreWhereInput = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const validSort: Record<string, keyof Prisma.StoreOrderByWithRelationInput> = {
      name: 'name', address: 'address',
    };
    const orderField = validSort[sortBy] ?? 'name';
    const order: Prisma.SortOrder = sortOrder === 'desc' ? 'desc' : 'asc';
    const orderBy: Prisma.StoreOrderByWithRelationInput = { [orderField]: order };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          ratings: { select: { rating: true, userId: true } },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.store.count({ where }),
    ]);

    const result = stores.map((store) => {
      const overallRating = store.ratings.length > 0
        ? store.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / store.ratings.length
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
