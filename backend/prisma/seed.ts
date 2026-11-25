import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const adminPassword = await bcrypt.hash('Admin@1234', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@storepulse.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@storepulse.com',
      password: adminPassword,
      address: '123 Admin Street, City',
      role: Role.admin,
    },
  });

  console.log(`✅ Admin seeded: ${admin.email}`);
  console.log(`   Password: Admin@1234`);
  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
