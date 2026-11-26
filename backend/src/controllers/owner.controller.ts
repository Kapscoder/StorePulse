import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// ── GET /api/owner/dashboard ─────────────────────────────────────
export const getOwnerDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) {
      res.status(404).json({ error: 'No store found for this owner' });
      return;
    }

    const averageRating = store.ratings.length > 0
      ? store.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / store.ratings.length
      : null;

    const raters = store.ratings.map((r) => ({
      userId: r.user.id,
      userName: r.user.name,
      userEmail: r.user.email,
      rating: r.rating,
      ratedAt: r.updatedAt,
    }));

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      totalRatings: store.ratings.length,
      raters,
    });
  } catch {
    res.status(500).json({ error: 'Failed to load owner dashboard' });
  }
};
