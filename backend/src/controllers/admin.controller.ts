import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { Prisma } from '@prisma/client';

// ── GET /api/admin/dashboard ─────────────────────────────────────
export const getDashboard = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
};

// ── GET /api/admin/users ─────────────────────────────────────────
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name, email, address, role,
      sortBy = 'name', sortOrder = 'asc',
      page = '1', limit = '10',
    } = req.query as Record<string, string>;

    const where: Prisma.UserWhereInput = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role && ['admin', 'normal_user', 'store_owner'].includes(role)) {
      where.role = role as Prisma.EnumRoleFilter['equals'];
    }

    const validSort: Record<string, keyof Prisma.UserOrderByWithRelationInput> = {
      name: 'name', email: 'email', address: 'address',
      role: 'role', createdAt: 'createdAt',
    };
    const orderField = validSort[sortBy] ?? 'name';
    const order: Prisma.SortOrder = sortOrder === 'desc' ? 'desc' : 'asc';
    const orderBy: Prisma.UserOrderByWithRelationInput = { [orderField]: order };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
        orderBy,
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page: parseInt(page), limit: take });
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ── GET /api/admin/users/:id ─────────────────────────────────────
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    type UserWithStore = Awaited<ReturnType<typeof prisma.user.findUnique>> & {
      ownedStore?: {
        id: string; name: string; address: string | null;
        ratings: { rating: number }[];
      } | null;
    };
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        ownedStore: {
          include: {
            ratings: { select: { rating: true } },
          },
        },
      },
    }) as UserWithStore | null;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let averageRating: number | null = null;
    if (user.role === 'store_owner' && user.ownedStore) {
      const ratings = user.ownedStore.ratings;
      averageRating = ratings.length > 0
        ? ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length
        : null;
    }

    const { password: _pw, ownedStore: _os, ...safeUser } = user as UserWithStore & { password: string };
    res.json({
      ...safeUser,
      ownedStore: user.ownedStore
        ? {
            id: user.ownedStore.id,
            name: user.ownedStore.name,
            address: user.ownedStore.address,
            averageRating,
          }
        : null,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// ── POST /api/admin/users ────────────────────────────────────────
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, address, role } = req.body as {
      name: string; email: string; password: string; address?: string; role: string;
    };

    if (!['admin', 'normal_user'].includes(role)) {
      res.status(400).json({ error: 'Role must be admin or normal_user. Use POST /admin/stores to create a store owner.' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, address, role: role as 'admin' | 'normal_user' },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });

    res.status(201).json({ message: 'User created', user });
  } catch {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// ── GET /api/admin/stores ────────────────────────────────────────
export const getStores = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name, email, address,
      sortBy = 'name', sortOrder = 'asc',
      page = '1', limit = '10',
    } = req.query as Record<string, string>;

    const where: Prisma.StoreWhereInput = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const validSort: Record<string, keyof Prisma.StoreOrderByWithRelationInput> = {
      name: 'name', email: 'email', address: 'address', createdAt: 'createdAt',
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
          owner: { select: { id: true, name: true, email: true } },
          ratings: { select: { rating: true } },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.store.count({ where }),
    ]);

    const result = stores.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      owner: s.owner,
      averageRating: s.ratings.length > 0
        ? s.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / s.ratings.length
        : null,
    }));

    res.json({ stores: result, total, page: parseInt(page), limit: take });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// ── POST /api/admin/stores ───────────────────────────────────────
export const createStore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, address, ownerName, ownerEmail, ownerPassword } = req.body as {
      name: string; email: string; address?: string;
      ownerName: string; ownerEmail: string; ownerPassword: string;
    };

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      res.status(409).json({ error: 'Store email already in use' });
      return;
    }

    const existingOwner = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (existingOwner) {
      res.status(409).json({ error: 'Owner email already in use' });
      return;
    }

    const hashedOwnerPw = await bcrypt.hash(ownerPassword, 12);

    const result = await prisma.$transaction(async (tx) => {
      const owner = await tx.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password: hashedOwnerPw,
          role: 'store_owner',
        },
      });

      const store = await tx.store.create({
        data: { name, email, address, ownerId: owner.id },
        include: {
          owner: { select: { id: true, name: true, email: true } },
        },
      });

      return { store, owner: { id: owner.id, name: owner.name, email: owner.email } };
    });

    res.status(201).json({ message: 'Store and owner created', ...result });
  } catch {
    res.status(500).json({ error: 'Failed to create store' });
  }
};

// ── GET /api/admin/stores/:id ────────────────────────────────────
export const getStoreById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    const averageRating = store.ratings.length > 0
      ? store.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / store.ratings.length
      : null;

    res.json({ ...store, averageRating });
  } catch {
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};
