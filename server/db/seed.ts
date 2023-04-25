import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () =>
  await prisma.user.createMany({
    data: [
      {
        username: 'Jane Doe',
        password: '123456',
        email: 'jane@doe.fr',
        role: 'admin',
      },
      {
        username: 'John Doe',
        password: '123456',
        email: 'john@doe.fr',
        role: 'user',
      },
    ],
  });

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
